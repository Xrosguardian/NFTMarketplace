import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>Copyright &copy; {year} NFTMarketplace. All rights reserved!</p>
        <ul className={styles.socialLinks}>
          <li>
            <Link href="https://github.com/Xrosguardian">
              <Image
                src="/github.png"
                width={40}
                height={40}
                alt="github logo"
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
