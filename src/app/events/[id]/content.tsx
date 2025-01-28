"use client";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  return <main>Content - {id}</main>;
};
