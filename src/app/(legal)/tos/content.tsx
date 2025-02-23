"use client"
import { Content } from "@/app/_components_/legal/content";
import type { Section } from "@/app/_components_/legal/types";

export const TermsOfUse = () => {
  return (
    <Content
      company={"big ticket"}
      important_message={important_message}
      sections={sections}
      footer={{ label: "privacy policy", href: "/privacy-policy" }}
      title={"terms of use"}
    />
  );
};

const important_message = `Welcome to Big Ticket Philippines ("we," "our," "us"). By accessing or using our web application ("App") or any of our services, you agree to comply with and be bound by these Terms of Use.

These terms govern your use of our App and services, including any content, features, and functionality offered. If you do not agree with these terms, do not use our app and website, nor purchase any products or services offered on our site.

We are committed to providing a safe and enjoyable experience for all users. Please read these Terms of Use carefully to understand your rights and responsibilities when using our App.`;

const sections: Section[] = [
  {
    keyId: 0,
    id: "account-registration",
    title: "Account Registration",
    content: `You may browse the Site without registering for an account. You will be required to register for an account to use certain features of the Site, such as reserving or purchasing a ticket. Your account username may not include the name of another person with the intent to impersonate that person, or be offensive, vulgar, or obscene. Your account username and password are personal to you. You will be responsible for the confidentiality and use of your username and password, and for all activities (including purchases) that are conducted through your account. You may not transfer or sell access to your account. We will not be liable for any harm related to disclosure of your username or password or the use by anyone else of your username or password. You may not use another user’s account without that user’s permission. You will immediately notify us in writing if you discover any unauthorized use of your account or other account-related security breach. We may require you to change your username and/or password if we believe your account is no longer secure, or if we receive a complaint that your username violates someone else’s rights. You will have no ownership in your account or your username. We may refuse registration, cancel an account, or deny access to the Site for any reason.`,
  },
  {
    keyId: 1,
    id: "code-of-conduct",
    title: "Code of Conduct",
    content: `By accessing and using our platform, ¹ YOU agree to use the platform (Website, App) lawfully and ethically. ² You MUST respect the rights and privacy of other users and refrain from engaging in harmful, abusive, or deceptive behavior. ³ You MUST respect copyrights, trademarks, and intellectual property rights. ⁴ Do NOT share, distribute, or modify copyrighted material without proper authorization. ⁵ Any content you submit must comply with community guidelines and legal standards. ⁶ Do NOT engage in illegal, fraudulent, or malicious activities. ⁷ Do NOT post or share content that is defamatory, offensive, or harmful. ⁸ Do NOT attempt to hack, disrupt, or gain unauthorized access to the system. ⁹ Do NOT harass, threaten, or impersonate others.`,
  },
  {
    keyId: 2,
    id: "ownership",
    title: "Ownership of Content",
    content: `The Site and all data, text, designs, pages, print screens, images, artwork, photographs, audio and video clips, and HTML code, source code, or software that reside or are viewable or otherwise discoverable on the Site, and all tickets obtained from the Site (collectively, the “Content”), are owned by us or our licensors. We own a copyright and, in many instances, patents and other intellectual property in the Site and Content. We may change the Content and features of the Site at any time.`,
  },
  {
    keyId: 3,
    id: "making-purchases",
    title: "Making Purchases",
    content: `Please review our Purchase Policy, which (in addition to the Terms) will govern your purchase of any tickets or other products through the Site, including any refunds or exchanges. We may impose conditions on your use of any coupon, promotional code, credit, or gift card. You will pay all charges incurred by you or any users of your account and credit card (or other applicable payment mechanism) at the price(s) in effect when such charges are incurred, including any applicable taxes. You may only use credit or debit cards, gift cards, or vouchers that belong to you or to people who expressly authorize you to use such payment methods.`,
  },
  {
    keyId: 4,
    id: "user-content",
    title: "Forums and User Content",
    content: `We may host fan reviews, message boards, blog feeds, social media feeds, and other forums found on the Site (collectively, Forums), and you may be able to submit suggestions, reviews, concepts, audio and video recordings, photographs, artwork, or other materials to the Forums or other areas of the Site (User Content). By submitting User Content, you certify that you are at least 18 years old, or that you are at least 13 years old and have obtained your parent’s or legal guardian’s express consent to submit User Content.`,
  },
  {
    keyId: 5,
    id: "claims-and-copyright",
    title: "Infringement on the Site",
    content: `Under the Digital Millennium Copyright Act of 1998 (the DMCA),  if you believe in good faith that any content on the Site infringes your copyright, you may send us a notice requesting that the content be removed. The notice must include: (a) your (or your agent’s) physical or electronic signature; (b) identification of the copyrighted work on our Site that is claimed to have been infringed (or a representative list if multiple copyrighted works are included in one notification); (c) identification of the content that is claimed to be infringing or the subject of infringing activity, including information reasonably sufficient to allow us to locate the content on the Site; (d) your name, address, telephone number, and email address (if available); (e) a statement that you have a good faith belief that use of the content in the manner complained of is not authorized by you or your agent or the law; and (f) a statement that the information in the notification is accurate and, under penalty of perjury, that you or your agent is authorized to act on behalf of the copyright owner. If you believe in good faith that a notice of copyright infringement has been wrongly filed against you, you may send us a counter-notice.`,
  },
  {
    keyId: 6,
    id: "links",
    title: "Links",
    content: `The Site contains links to other websites that may not be owned or operated by us. The fact that we may link to those websites does not indicate any approval or endorsement of those websites. We have no control over those websites. We are not responsible for the content of those websites, or the privacy practices of those websites. We strongly encourage you to become familiar with the terms of use and practices of any linked website. Your use of other websites is at your own risk, and is subject to the terms of those websites. It is up to you to take precautions to ensure that whatever links you select or software you download (whether from the Site or other sites) is free of viruses, worms, Trojan horses, defects, date bombs, time bombs, and other items of a destructive nature.`,
  },
  {
    keyId: 7,
    id: "parental-controls",
    title: "Parental Controls",
    content: `We cannot prohibit minors from visiting our Site and must rely on parents and guardians to decide what materials are appropriate for children to view and purchase. There are parental control protections (such as computer hardware, software, or filtering services) available that may assist you in limiting access to material that is harmful to minors. You can find information about parental controls at www.onguardonline.gov. We do not endorse the products or services listed at that website.`,
  },
  {
    keyId: 8,
    id: "mobile-messaging",
    title: "Mobile Messaging",
    content: `We offer browsing and mobile messaging services which may include alerts, Promotions, and offers for products. You may choose to receive mobile alerts by signing up or participating in a Promotion. If you do, you authorize us to use automated technology to send messages to the mobile phone number you supply when you sign up. Your consent to receive mobile communications is never required in order to purchase something from us. Message and data rates may apply, according to your rate plan provided by your wireless carrier. We will not be responsible for any text messaging or other wireless charges incurred by you or by a person who has access to your wireless device or telephone number. You may not receive our alerts if your carrier does not permit text alerts. Your carrier may not allow you to use pre-paid phones or calling plans to receive alerts. We may send you a bounce back message for every message you send to us. Service may not be compatible with all wireless carriers or devices.`,
  },
  {
    keyId: 9,
    id: "mobile-app",
    title: "Mobile App",
    content: `If you install or use our mobile application, software, and services, including any accompanying documentation (collectively, the "App"), we grant you a limited right to install and use the App on multiple authorized device located anywhere in the Philippines and its territories, or in another country where we may offer the App. You may use the App for your personal, non-commercial, and entertainment purposes only. We do not grant you any rights to any related documentation, support, upgrades, maintenance, or other enhancements to the App. We will not provide you with any device, internet access, or wireless connection to use the App. We are not responsible for any interaction between you and another App user, or information you transmit through the App.`,
  },
];
