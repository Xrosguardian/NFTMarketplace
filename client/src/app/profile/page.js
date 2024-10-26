"use client";
import { WalletContext } from "../context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import styles from "./profile.module.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import axios from "axios";
import NFTCard from "../components/nftcard/NFTCard";

export default function Profile() {
  const [items, setItems] = useState();
  const [totalPrice, setTotalPrice] = useState("0");
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getNFTitems() {
    let sumPrice = 0;
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    let transaction = await contract.getMyNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = ethers.formatEther(i.price);

      const item = {
        price,
        tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };

      itemsArray.push(item);
      sumPrice += Number(price);
    }
    return { itemsArray, sumPrice };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { itemsArray, sumPrice } = await getNFTitems();
        setItems(itemsArray);
        setTotalPrice(sumPrice);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.innerContainer}>
        <div className={styles.content}>
          {isConnected ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.label}>Wallet Address:</span>
                <p className={styles.address}>{userAddress}</p>
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Number of NFTs:</span>
                  <p className={styles.value}>{items?.length}</p>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Total Value:</span>
                  <p className={styles.value}>{totalPrice} ETH</p>
                </div>
              </div>
              <div className={styles.nftSection}>
                <h2 className={styles.heading}>Your NFTs</h2>
                {items?.length > 0 ? (
                  <div className={styles.nftGrid}>
                    {items?.map((value, index) => (
                      <NFTCard item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noNFT}>You don't have any NFT...</div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.notConnected}>You are not connected...</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
