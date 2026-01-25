import { useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import PayveABI from '../abis/Payve.json';
import MockIDRXABI from '../abis/MockIDRX.json';
import { PAYVE_ADDRESS, IDRX_ADDRESS } from '../constants';
import { useCallback } from 'react';

export function usePayve() {
    const { writeContractAsync } = useWriteContract();

    const publicClient = usePublicClient();

    // --- Company Actions ---

    const createInvite = useCallback(async (hash: string, name: string, salary: bigint) => {
        return writeContractAsync({
            abi: PayveABI,
            address: PAYVE_ADDRESS,
            functionName: 'createInvite',
            args: [hash, name, salary],
        });
    }, [writeContractAsync]);

    const deposit = useCallback(async (amount: bigint) => {
        // 1. Approve
        const hash = await writeContractAsync({
            abi: MockIDRXABI,
            address: IDRX_ADDRESS,
            functionName: 'approve',
            args: [PAYVE_ADDRESS, amount],
        });

        // Wait for approval to be mined
        if (publicClient) {
            await publicClient.waitForTransactionReceipt({ hash });
        }

        // 2. Deposit
        return writeContractAsync({
            abi: PayveABI,
            address: PAYVE_ADDRESS,
            functionName: 'deposit',
            args: [amount],
        });
    }, [writeContractAsync, publicClient]);

    const distribute = useCallback(async () => {
        return writeContractAsync({
            abi: PayveABI,
            address: PAYVE_ADDRESS,
            functionName: 'distribute',
        });
    }, [writeContractAsync]);

    // --- Employee Actions ---

    const claimInvite = useCallback(async (secret: string) => {
        return writeContractAsync({
            abi: PayveABI,
            address: PAYVE_ADDRESS,
            functionName: 'claimInvite',
            args: [secret],
        });
    }, [writeContractAsync]);

    const withdraw = useCallback(async () => {
        return writeContractAsync({
            abi: PayveABI,
            address: PAYVE_ADDRESS,
            functionName: 'withdraw',
            // Note: For Paymaster, we'd add 'capabilities' here later
        });
    }, [writeContractAsync]);

    return {
        createInvite,
        deposit,
        distribute,
        claimInvite,
        withdraw
    };
}

export function usePayveData(address: string | undefined) {
    const { data: employee } = useReadContract({
        abi: PayveABI,
        address: PAYVE_ADDRESS,
        functionName: 'getEmployee',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    return { employee };
}
