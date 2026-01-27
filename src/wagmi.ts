import { http, createConfig } from 'wagmi';
import { baseSepolia, localhost } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
    chains: [baseSepolia, localhost],
    multiInjectedProviderDiscovery: false,
    connectors: [
        coinbaseWallet({
            appName: 'Payve',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [localhost.id]: http(),
        [baseSepolia.id]: http(),
    },
});
