import cs from 'classnames';
import styles from './styles.module.scss';

export type FooterLinkColumn = {
  title: string;
  href: string;
};

export default function FooterNavigation() {
  const Links: FooterLinkColumn[] = [
    {
      title: 'Website',
      href: 'https://oceanprotocol.com/',
    },
    {
      title: 'Discord',
      href: 'https://discord.com/invite/TnXjkR5',
    },
    {
      title: 'Blog',
      href: 'https://blog.oceanprotocol.com/',
    },
    {
      title: 'Twitter',
      href: 'https://twitter.com/oceanprotocol',
    },
    {
      title: 'Telegram',
      href: 'https://t.me/OceanProtocol_Community',
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com/oceanprotocol_/',
    },
    {
      title: 'Whitepaper',
      href: 'https://oceanprotocol.com/tech-whitepaper.pdf',
    },
    {
      title: 'GitHub',
      href: 'https://github.com/oceanprotocol',
    },
    {
      title: 'Docs',
      href: 'https://github.com/oceanprotocol/docs',
    },
  ];

  return (
    <div>
      <div
        className={cs(
          styles.gap20,
          'd-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-start text-white me-0 me-md-5 mb-3 mb-md-0'
        )}
      >
        <div className="d-flex flex-column">
          {Links.slice(0, 3).map((link: FooterLinkColumn) => {
            return (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cs(styles.link, 'poppins14 bg-transparent border-0')}
              >
                {link.title}
              </a>
            );
          })}
        </div>
        <div className="d-flex flex-column">
          {Links.slice(3, 6).map((link: FooterLinkColumn) => {
            return (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cs(styles.link, 'poppins14 bg-transparent border-0')}
              >
                {link.title}
              </a>
            );
          })}
        </div>
        <div className="d-flex flex-column">
          {Links.slice(6, 9).map((link: FooterLinkColumn) => {
            return (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cs(styles.link, 'poppins14 bg-transparent border-0')}
              >
                {link.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
