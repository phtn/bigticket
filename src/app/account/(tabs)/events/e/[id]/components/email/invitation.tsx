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

export const BigTicketInvitation = ({
  name,
  email,
  ticket_count,
  event_id,
  event_name,
}: VIP) => {
  const baseUrl = `https://bigticket.ph`;
  const previewText = `You are invited!`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-gray-200 font-sans">
          <Container className="my-[40px] flex w-full max-w-[465px] rounded-lg border-[0.33px] border-[#14141b] bg-white p-[24px] shadow-lg">
            <Section className="mt-[32px]">
              <Img
                src={`https://nt5z0eivn0.ufs.sh/f/Vt8KHVjAitXarsJJzIM9F1nEbfGKBL7YMWNcipkCUS4wjQas`}
                width="auto"
                height="100"
                alt="big-ticket-wordmark"
                className="mx-auto"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal tracking-tight text-black">
              You&apos;re invited!
            </Heading>
            <Section className="px-10">
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>{"Hello, "}</strong> {name} - (
                <Link
                  href={`mailto:${email}`}
                  className="text-blue-600 no-underline"
                >
                  {email}
                </Link>
                )
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                Your <strong>{event_name}</strong> exclusive VIP ticket grants
                you priority entry, premium seating, and special perks. Scan
                your QR code at the entrance and enjoy the show!
              </Text>
            </Section>
            <Section className="mx-auto mb-[32px] mt-[32px] flex items-center px-[24px] text-center">
              <Button
                className="flex h-8 w-[300px] items-center justify-center rounded-lg bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={baseUrl + `/?x=${event_id}`}
              >
                Claim {ticket_count} VIP Ticket{ticket_count > 1 ? "s" : ""}
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={baseUrl + `/?x=${event_id}`}
                className="text-[12px] text-blue-600 no-underline"
              >
                {baseUrl + `/?x=${event_id}`}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Section className="p-10">
              <Text className="text-[12px] leading-[24px] text-[#666666]">
                This invitation was intended for{" "}
                <span className="text-black">{name}</span>. This invite was sent
                from <span className="text-black">{"ip"}</span> located in{" "}
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
