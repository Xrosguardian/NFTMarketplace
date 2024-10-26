"use client";
import { useContext } from "react";
import styles from "./header.module.css";
import { WalletContext } from "@/app/context/wallet";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);
      const network = await provider.getNetwork();
      const chainID = network.chainId;
      const sepoliaNetworkId = "11155111";

      if (chainID.toString() !== sepoliaNetworkId) {
        alert("Please switch your MetaMask to the Sepolia network");
        return;
      }
    } catch (error) {
      console.error("Connection error: ", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/logo.png"
              width={300}
              height={50}
              objectFit="cover"
              alt="logo"
            />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/marketplace" className={styles.link}>
                MarketPlace
              </Link>
            </li>
            <li>
              <Link href="/sellNFT" className={styles.link}>
                Sell NFT
              </Link>
            </li>
            <li>
              <Link href="/profile" className={styles.link}>
                Profile
              </Link>
            </li>
          </ul>
          <button
            className={`${styles.ctaBtn} ${
              isConnected ? styles.activebtn : styles.inactivebtn
            }`}
            onClick={connectWallet}
            aria-label={
              isConnected ? `Connected as ${userAddress}` : "Connect wallet"
            }>
            {isConnected ? (
              <>{userAddress?.slice(0, 8)}...</>
            ) : (
              "Connect wallet"
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
