import { useReadContract, useWriteContract, usePublicClient, useAccount } from 'wagmi';
import PayveABI from '../abis/Payve.json';
import PayveFactoryABI from '../abis/PayveFactory.json';
import MockIDRXABI from '../abis/MockIDRX.json';
import { PAYVE_FACTORY_ADDRESS, IDRX_ADDRESS } from '../constants';
import { useCallback } from 'react';

// Type for employee data returned from smart contract
export interface EmployeeData {
    name: string;
    salary: bigint;
    balance: bigint;
    isActive: boolean;
}

export function usePayve() {
    const { writeContractAsync } = useWriteContract();
    const { address } = useAccount();

    const publicClient = usePublicClient();

    // Check if user has a company
    const { data: companyAddress, refetch: refetchCompany } = useReadContract({
        abi: PayveFactoryABI.abi,
        address: PAYVE_FACTORY_ADDRESS,
        functionName: 'getCompany',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!PAYVE_FACTORY_ADDRESS && PAYVE_FACTORY_ADDRESS !== ""
        }
    });

    // Don't treat 0x0 as a valid company address
    const myCompanyAddress = companyAddress === '0x0000000000000000000000000000000000000000' ? undefined : companyAddress as `0x${string}`;

    // --- Factory Actions ---

    const createCompany = useCallback(async () => {
        const tx = await writeContractAsync({
            abi: PayveFactoryABI.abi,
            address: PAYVE_FACTORY_ADDRESS as `0x${string}`,
            functionName: 'createCompany',
        });
        // We probably want to wait for receipts usually, but simple return for now
        return tx;
    }, [writeContractAsync]);

    // --- Company Actions ---

    const createInvite = useCallback(async (hash: string, name: string, salary: bigint) => {
        if (!myCompanyAddress) throw new Error("No company found");
        return writeContractAsync({
            abi: PayveABI.abi,
            address: myCompanyAddress,
            functionName: 'createInvite',
            args: [hash, name, salary],
        });
    }, [writeContractAsync, myCompanyAddress]);

    const deposit = useCallback(async (amount: bigint) => {
        if (!myCompanyAddress) throw new Error("No company found");
        // 1. Approve
        const hash = await writeContractAsync({
            abi: MockIDRXABI.abi,
            address: IDRX_ADDRESS as `0x${string}`,
            functionName: 'approve',
            args: [myCompanyAddress, amount],
        });

        // Wait for approval to be mined
        if (publicClient) {
            await publicClient.waitForTransactionReceipt({ hash });
        }

        // 2. Deposit
        return writeContractAsync({
            abi: PayveABI.abi,
            address: myCompanyAddress,
            functionName: 'deposit',
            args: [amount],
        });
    }, [writeContractAsync, publicClient, myCompanyAddress]);

    const distribute = useCallback(async () => {
        if (!myCompanyAddress) throw new Error("No company found");
        return writeContractAsync({
            abi: PayveABI.abi,
            address: myCompanyAddress,
            functionName: 'distribute',
        });
    }, [writeContractAsync, myCompanyAddress]);

    // --- Employee Actions ---

    // For employees, they need to target a SPECIFIC company contract
    const claimInvite = useCallback(async (targetCompanyAddress: string, secret: string) => {
        return writeContractAsync({
            abi: PayveABI.abi,
            address: targetCompanyAddress as `0x${string}`,
            functionName: 'claimInvite',
            args: [secret],
        });
    }, [writeContractAsync]);

    const withdraw = useCallback(async (targetCompanyAddress: string) => {
        return writeContractAsync({
            abi: PayveABI.abi,
            address: targetCompanyAddress as `0x${string}`,
            functionName: 'withdraw',
            // Note: For Paymaster, we'd add 'capabilities' here later
        });
    }, [writeContractAsync]);

    const mint = useCallback(async (amount: bigint) => {
        return writeContractAsync({
            abi: MockIDRXABI.abi,
            address: IDRX_ADDRESS as `0x${string}`,
            functionName: 'mint',
            args: [address, amount], // Mint to self
        });
    }, [writeContractAsync, address]);

    return {
        myCompanyAddress,
        createCompany,
        createInvite,
        deposit,
        distribute,
        claimInvite,
        withdraw,
        mint,
        refetchCompany
    };
}

export function usePayveData(contractAddress: string | undefined) {
    const { address } = useAccount();
    const { data: employee, isLoading, error } = useReadContract({
        abi: PayveABI.abi,
        address: contractAddress ? contractAddress as `0x${string}` : undefined,
        functionName: 'getEmployee',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000'
        }
    });

    // Smart contract returns object with named properties OR tuple array depending on ABI
    // Handle both cases
    let employeeData: EmployeeData | undefined;
    
    if (employee) {
        // Check if it's an object with named properties
        if (typeof employee === 'object' && 'name' in employee) {
            const obj = employee as { name: string; salary: bigint; balance: bigint; isActive: boolean };
            employeeData = {
                name: obj.name,
                salary: obj.salary,
                balance: obj.balance,
                isActive: obj.isActive,
            };
        } 
        // Or if it's a tuple array [name, salary, balance, isActive]
        else if (Array.isArray(employee)) {
            const arr = employee as [string, bigint, bigint, boolean];
            employeeData = {
                name: arr[0],
                salary: arr[1],
                balance: arr[2],
                isActive: arr[3],
            };
        }
    }

    return { employee: employeeData, isLoading, error };
}
