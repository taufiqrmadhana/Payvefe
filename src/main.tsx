  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import '@coinbase/onchainkit/styles.css';
  import { WagmiProvider } from 'wagmi';
  import { config } from './wagmi';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { OnchainKitProvider } from '@coinbase/onchainkit';
  import { baseSepolia } from 'wagmi/chains';

  const queryClient = new QueryClient();

  createRoot(document.getElementById("root")!).render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia}>
          <App />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
  