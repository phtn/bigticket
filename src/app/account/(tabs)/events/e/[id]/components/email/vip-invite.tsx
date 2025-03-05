import { env } from "@/env";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { VIP } from "convex/events/d";

export const VIPInvitation = ({
  name,
  ticket_count,
  event_id,
  event_name,
}: VIP) => {
  const baseUrl = `https://bigticket.ph`;
  const tickets = ticket_count > 1 ? "tickets" : "ticket";
  const previewText = `You are invited with ${ticket_count} VIP ${tickets}!`;
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}.firebasestorage.app/o/wordmark.png?alt=media&token=${env.FIREBASE_STORAGE_TOKEN}`;
  const backupUrl = `https://nt5z0eivn0.ufs.sh/f/Vt8KHVjAitXarsJJzIM9F1nEbfGKBL7YMWNcipkCUS4wjQas`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto flex w-full max-w-[400px] justify-center rounded-lg bg-gray-200 py-[2px] font-sans">
          <Container className="flex w-full rounded-lg border-[0.33px] border-[#14141b] bg-white p-[24px] shadow-lg">
            <Section className="mt-[32px]">
              <Img
                src={imageUrl ?? backupUrl}
                width="auto"
                height="100"
                alt="big-ticket-wordmark"
                className="mx-auto bg-transparent"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal tracking-tight text-black">
              You&apos;re invited!
            </Heading>
            <Section className="px-2">
              <Text className="text-left text-[14px] leading-[24px] text-[#14141b]">
                <strong className="tracking-tighter">Hello, {name} 👋🏽 </strong>
              </Text>
              <Text className="text-justify text-[14px] leading-[24px] text-[#14141b]">
                You are invited to <strong>{event_name}</strong> exclusive
                event! You&apos;re VIP {tickets} grants you priority entry,
                premium seating, and special perks. Scan your QR code at the
                entrance and enjoy the show!
              </Text>
            </Section>
            <Section className="mb-[32px] mt-[32px] flex w-full items-center justify-center px-4 text-center">
              <Button
                className="flex h-fit w-[270px] items-center justify-center rounded-lg bg-[#14141b] py-1 no-underline"
                href={baseUrl + `/?x=${event_id}`}
              >
                <Text className="whitespace-nowrap pl-[70px] text-center text-[16px] font-semibold tracking-tight text-[#F3FCEE]">
                  Claim <strong>{ticket_count} VIP</strong> {tickets}
                </Text>
              </Button>
            </Section>
            <Text className="p-3 text-[14px] leading-[24px] text-[#14141b]">
              or copy and paste this URL into your browser: <br />
              <Link
                href={baseUrl + `/?x=${event_id}`}
                className="text-[12px] text-[#007AFE] no-underline"
              >
                {baseUrl + `/?x=${event_id}`}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Section className="p-4">
              <Text className="text-justify text-[12px] leading-[24px] text-[#666666]">
                This invitation was intended for{" "}
                <span className="text-black">{name}</span>. This invite was sent
                from <span className="text-black">{"IP"}</span> located in{" "}
                <span className="text-black">{"Manila, Philippines"}</span>. If
                you were not expecting this invitation, you can ignore this
                email. If you are concerned about your account&apos;s safety,
                please reply to this email to get in touch with us.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
