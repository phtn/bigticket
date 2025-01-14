"use client";

import { useMemo } from "react";
import { PrivacyPolicies } from "./policy";
import { Sidebar } from "./sidebar";
import { Button } from "@nextui-org/react";
import { Icon } from "@/icons";
import { useToggle } from "@/hooks/useToggle";
import Link from "next/link";

export interface Section {
  keyId: number;
  id: string;
  title: string;
  content: string;
}

interface ContentProps {
  company: string;
}

export const Content = ({ company }: ContentProps) => {
  const { open, toggle } = useToggle();

  const sections: Section[] = useMemo(
    () => [
      {
        keyId: 0,
        id: "introduction",
        title: "Introduction",
        content: `This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you interact with our services. We are committed to protecting your privacy and handling your data in a transparent and responsible manner.`,
      },
      {
        keyId: 1,
        id: "information-collection",
        title: "Information Collection",
        content: `We collect information you provide directly to us, as well as data generated from your interactions with our services. This may include personal identifiers, account credentials, payment information, communication data, and usage information. We collect this information through various channels, including website forms, email correspondence, and automated data collection technologies.`,
      },
      {
        keyId: 2,
        id: "use-of-information",
        title: "Use of Information",
        content: `We use the collected information for several purposes, including but not limited to: providing and maintaining our services, improving and personalizing user experience, processing transactions, communicating about our services and offerings, conducting analytics and research, and ensuring the security and integrity of our platform. We process your information in compliance with applicable data protection laws and regulations.`,
      },
      {
        keyId: 3,
        id: "data-sharing",
        title: "Data Sharing and Disclosure",
        content: `We may share your information in specific circumstances, including: with your explicit consent, to comply with legal obligations, to protect our rights and safety, with service providers who assist us in operating our business, and in connection with a business transfer or similar transaction. We implement appropriate safeguards when transferring data and ensure that third parties adhere to our privacy standards.`,
      },
      {
        keyId: 4,
        id: "data-security",
        title: "Data Security",
        content: `We implement a variety of security measures to maintain the safety of your personal information. These include encryption of data in transit and at rest, regular security assessments, access controls, and employee training on data protection. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
      },
      {
        keyId: 5,
        id: "user-rights",
        title: "Your Rights and Choices",
        content: `Depending on your location, you may have certain rights regarding your personal information. These may include the right to access, correct, delete, or restrict processing of your data, as well as the right to data portability and to withdraw consent. We are committed to facilitating the exercise of these rights and provide mechanisms for you to do so.`,
      },
      {
        keyId: 6,
        id: "international-transfers",
        title: "International Data Transfers",
        content: `Your information may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.`,
      },
      {
        keyId: 7,
        id: "children-privacy",
        title: `Children's Privacy`,
        content: `Our services are not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.`,
      },
      {
        keyId: 8,
        id: "policy-updates",
        title: "Updates to This Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.`,
      },
      {
        keyId: 9,
        id: "contact",
        title: "Contact Us",
        content: `If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@example.com or by mail at: Office of the Data Protection Officer, 123 Privacy Avenue, Washington, D.C. 20001, United States.`,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white font-inter transition-colors duration-300">
      <div className="flex">
        <Sidebar sections={sections} isOpen={open} toggleFn={toggle} />
        <div
          className={`flex-1 transition-all duration-300 ${open ? "ml-64" : "ml-0"}`}
        >
          <div className="mx-auto max-w-4xl p-2 sm:px-6 lg:px-8">
            <Header toggle={toggle} company={company} />

            <PrivacyPolicies sections={sections} />

            <Footer company={company} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = (props: { company: string; toggle: VoidFunction }) => (
  <div className="flex items-center justify-between border-b-[0.33px] border-primary-200 py-4">
    <h1 className="space-x-2 text-3xl font-medium tracking-tighter text-gray-900">
      <span className="font-extrabold">{props.company}</span>{" "}
      <span>Privacy Policy</span>
    </h1>
    <div className="flex items-center space-x-4">
      <Button
        size="sm"
        isIconOnly
        variant="light"
        onPress={props.toggle}
        aria-label="Toggle sidebar"
      >
        <Icon name="Toc" className="size-4" />
      </Button>
      <Button
        size="sm"
        isIconOnly
        variant="light"
        onPress={() => window.print()}
        aria-label="Print policy"
      >
        <Icon name="Printer" className="size-4 stroke-0" />
      </Button>
    </div>
  </div>
);

const Footer = (props: { company: string }) => (
  <footer className="mb-8 mt-12 flex items-center justify-between text-center text-xs text-primary">
    <section className="flex items-center space-x-2">
      <p>
        {props.company} &copy;{new Date().getFullYear()}
      </p>
      <p>|</p>
      <Link href={"/tos"}>Terms of Use</Link>
    </section>
    <p>
      Last updated:{" "}
      {new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </footer>
);
