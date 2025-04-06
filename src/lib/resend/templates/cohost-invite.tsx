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

export interface CohostInvitationProps {
  name: string;
  event_id: string;
  event_name: string;
  host?: string;
  email?: string;
}

export const CohostInvitation = ({
  name,
  event_id,
  event_name,
  email,
  host,
}: CohostInvitationProps) => {
  const baseUrl =
    env.NODE_ENV === "production"
      ? "https://bigticket.ph/confirm/cohosted"
      : "http://localhost:3000/confirm/cohosted";
  const previewText = `You are invited to be a co-host for the ${event_name} event!`;
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}.firebasestorage.app/o/public%2Fwordmark.png?alt=media&token=${env.FIREBASE_STORAGE_TOKEN}`;
  const e = email && btoa(email);
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto flex w-full max-w-[400px] justify-center rounded-lg bg-gray-200 py-[2px] font-sans">
          <Container className="flex w-fit max-w-[465px] rounded-lg border-[0.33px] border-[#14141b] bg-white p-[24px] shadow-lg">
            <Section className="mt-[32px]">
              <Img
                src={imageUrl}
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
                You are invited to be a co-host for the{" "}
                <strong>{event_name}</strong> event by {host}.
              </Text>
            </Section>
            <Section className="mb-[32px] mt-[32px] flex w-full items-center justify-center px-4 text-center">
              <Button
                className="flex h-fit w-[270px] items-center justify-center rounded-lg bg-[#14141b] py-1 no-underline"
                href={baseUrl + `/?x=${event_id}&cohost=true&e=${e}`}
              >
                <Text className="whitespace-nowrap pl-[24px] text-center text-[16px] font-semibold tracking-tight text-[#F3FCEE]">
                  Click <strong>here</strong> to accept invitation
                </Text>
              </Button>
            </Section>
            <Text className="p-3 text-[14px] leading-[24px] text-[#14141b]">
              or copy and paste this URL into your browser: <br />
              <Link
                href={baseUrl + `/?x=${event_id}&cohost=true&e=${e}`}
                className="text-[12px] text-[#007AFE] no-underline"
              >
                {baseUrl + `/?x=${event_id}&cohost=true&e=${e}`}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Section className="px-4 pb-10 pt-4">
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
