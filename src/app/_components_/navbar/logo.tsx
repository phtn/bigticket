import Image from "next/image";
// import { CldImage } from "next-cloudinary";
export const Logo = () => {
  return (
    <div className="flex aspect-auto h-16 w-auto items-center px-4">
      <Image
        src="https://res.cloudinary.com/dx0heqhhe/image/upload/v1755954383/big-ticket-logo_q0gwxw.avif"
        width={3800}
        height={1048}
        // preserveTransformations
        alt="big-ticket-logo"
        className="h-12 w-auto"
      />
    </div>
  );
};
