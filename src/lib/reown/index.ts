import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";
import { env } from "@/env";

const core = new Core({
  projectId: env.WC_PROJECT_ID,
});

const metadata = {
  name: "Big Ticket",
  description: "Wallet Connect AppKit",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

export const walletKit = await WalletKit.init({
  core, // <- pass the shared 'core' instance
  metadata,
});
