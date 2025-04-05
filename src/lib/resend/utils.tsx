import { type EmailType } from "./schema";
import { VIPInvitation, type VIPInvitationProps } from "./templates/vip-invite";
import {
  CohostInvitation,
  type CohostInvitationProps,
} from "./templates/cohost-invite";

export function getEmailTemplate<T>(type: EmailType, data: T) {
  switch (type) {
    case "VIP_INVITE":
      return <VIPInvitation {...(data as VIPInvitationProps)} />;
    case "COHOST_INVITE":
      return <CohostInvitation {...(data as CohostInvitationProps)} />;
    default:
      throw new Error("Invalid email type");
  }
}
