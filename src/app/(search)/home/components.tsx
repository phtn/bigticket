// export const CardListItem = ({
//   title,
//   subtitle,
//   color,
//   isActive,
// }: {
//   title: string;
//   subtitle: string;
//   color: string;
//   isActive?: boolean;
// }) => {
//   return (
//     <div
//       className={`rounded-[2.5rem] p-4 ${isActive ? color : "bg-gray-900"} cursor-pointer transition-colors`}
//     >
//       <div className="flex items-center gap-3">
//         <div
//           className={`rounded-full p-2 ${isActive ? "bg-white" : "bg-gray-800"}`}
//         >
//           <div className="h-6 w-6" />
//         </div>
//         <div className={isActive ? "text-black" : "text-white"}>
//           <h3 className="font-medium">{title}</h3>
//           <p
//             className={`text-sm ${isActive ? "text-gray-600" : "text-gray-400"}`}
//           >
//             {subtitle}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const ActivityItem = ({
//   title,
//   date,
//   amount,
// }: {
//   title: string;
//   date: string;
//   amount: string;
// }) => {
//   return (
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="font-medium">{title}</p>
//         <p className="text-sm text-gray-400">{date}</p>
//       </div>
//       <p className="font-medium">{amount}</p>
//     </div>
//   );
// };

// export const MobileCards = () => {
//   return (
//     <>
//       <Card className="relative w-full rounded-[2.5rem] bg-[#E1EAE3] px-4 py-8">
//         <div className="flex items-center gap-3 bg-[#E1EAE3]">
//           <div className="rounded-full bg-white p-2">
//             <Image
//               src="/icon/icon.svg"
//               alt="big-ticket logo"
//               className="size-8"
//             />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">Harmony Space</h2>
//             <p className="text-sm text-gray-600">Wellness & Yoga</p>
//           </div>
//         </div>
//         <div className="absolute -right-6 top-4">
//           <Image
//             src="/svg/drinks.svg"
//             alt="cocktail-drink"
//             className="ml-auto size-28"
//           />
//         </div>
//       </Card>
//       <Card
//         isFooterBlurred
//         className="h-[300px] w-full rounded-[2.5rem] border border-primary-700"
//       >
//         <CardHeader className="absolute left-2 top-2 z-10 flex-col items-start">
//           <p className="text-tiny font-bold uppercase text-white/60">
//             All night Rave + dj Youna
//           </p>
//           <h4 className="text-xl font-medium capitalize text-white/90">
//             Chain breaker night
//           </h4>
//         </CardHeader>
//         <Image
//           removeWrapper
//           alt="Relaxing app background"
//           className="z-0 h-full w-full object-cover"
//           src="https://tripjive.com/wp-content/uploads/2024/11/How-can-I-enjoy-Boracays-nightlife.jpg"
//         />
//         <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
//           <div className="flex flex-grow items-center gap-2">
//             <Image
//               alt="Breathing app icon"
//               className="h-11 w-10 rounded-full bg-black"
//               src="https://nextui.org/images/breathing-app-icon.jpeg"
//             />
//             <div className="flex flex-col">
//               <p className="text-tiny font-bold text-white/70">X Club</p>
//               <p className="text-tiny uppercase text-white/70">
//                 SAT &middot; feb 1 &middot; 9pm-3am
//               </p>
//             </div>
//           </div>
//           <Button
//             size="sm"
//             isIconOnly
//             radius="full"
//             color="secondary"
//             className="flex items-center font-inter font-semibold tracking-tighter"
//           >
//             <Iconx name="arrow-right-02" className="size-4" />
//           </Button>
//         </CardFooter>
//       </Card>
//       <Card
//         isFooterBlurred
//         className="rounded-[2.5rem] bg-[#F5B963] p-4 text-black"
//       >
//         <div className="mb-2 flex items-center gap-3">
//           <div className="rounded-full bg-black p-2">
//             <Image
//               src="/svg/drinks.svg"
//               alt="Leaf logo"
//               className="size-6 invert"
//             />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">Bloom & Ember</h2>
//             <p className="text-sm text-gray-700">Farm grocery shopping</p>
//           </div>
//           <div className="ml-auto">
//             <Button variant="ghost" isIconOnly>
//               <Iconx name="heart-check" className="size-5" />
//             </Button>
//           </div>
//         </div>

//         <div className="my-4 rounded-xl bg-white/80 p-4">
//           <Image
//             src="/svg/drinks.svg"
//             alt="Barcode"
//             width={200}
//             height={60}
//             className="w-full"
//           />
//           <p className="mt-2 text-center font-mono">4567-8716-3459</p>
//         </div>

//         <CardFooter>
//           <div className="mt-4 flex justify-between">
//             <div>
//               <p className="text-sm text-gray-700">Available</p>
//               <p className="text-xl font-semibold">5617 points</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-700">Status</p>
//               <p className="text-xl font-semibold">Gold</p>
//             </div>
//           </div>
//         </CardFooter>
//       </Card>

{
  /* <Card className="rounded-3xl bg-[#E1EAE3] p-4 text-black">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nimbus Air</h2>
          <div className="flex gap-2">
            <Button variant="ghost" isIconOnly className="h-8 w-8">
              <Icon name="MoreVertical" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" isIconOnly className="h-8 w-8">
              <Icon name="MoreVertical" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" isIconOnly className="h-8 w-8">
              <Icon name="MoreVertical" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" isIconOnly className="h-8 w-8">
              <Icon name="MoreVertical" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <h3 className="text-2xl font-bold">BCN</h3>
          <div className="text-2xl">✈</div>
          <h3 className="text-2xl font-bold">MAD</h3>
        </div>

        <p className="mb-4 text-sm text-gray-600">Barcelona to Madrid</p>

        <Button className="w-full bg-black text-white hover:bg-black/90">
          <Icon name="MoreVertical" className="mr-2 h-4 w-4" /> Add to Wallet
        </Button>
      </Card> */
}
//     </>
//   );
// };

// export const AuthContentHeader = () => (
//   <div className="flex items-start justify-between font-inter">
//     <div className="space-y-1">
//       <div className="z-1 relative flex h-8 items-end space-x-2 leading-none">
//         <h1 className="text-xl font-semibold tracking-tighter text-primary/90">
//           My Tickets
//         </h1>
//         <div className="relative flex size-8 items-center justify-center">
//           <Iconx
//             name="squircle"
//             fill="#ccc"
//             stroke="#ccc"
//             className="absolute size-full opacity-30 drop-shadow-sm"
//           />
//           <p className="absolute text-sm font-medium opacity-80">3</p>
//         </div>
//         <Button isIconOnly size="sm" variant="light">
//           <Iconx name="ticket-horizontal" className="size-4" />
//         </Button>
//       </div>
//       <p className="text-xs text-gray-500">Manage tickets and passes</p>
//     </div>
//     <div className="flex items-center">
//       <Avatar
//         size="md"
//         radius="none"
//         className="size-10 bg-transparent"
//         src="/icon/icon.svg"
//       />
//     </div>
//   </div>
// );

// export const CardList = () => (
//   <aside className="h-full w-full border-r bg-coal">
//     <div className="portrait:px-4">
//       <div className="flex items-center justify-between p-6">
//         <div className="flex items-center space-x-1">
//           <div className="relative flex size-6 items-center justify-center">
//             <Icon
//               name="Fire"
//               fill="transparent"
//               stroke="papayawhip"
//               className="absolute size-full -rotate-[4deg] opacity-60"
//             />
//             <Icon
//               name="Fire"
//               fill="blue"
//               stroke="indigo"
//               className="absolute size-5 -rotate-[3deg] opacity-40"
//             />
//             <Icon
//               name="Fire"
//               fill="transparent"
//               stroke="orange"
//               className="absolute size-6 rotate-[1deg] opacity-40"
//             />
//             <Icon
//               name="Fire"
//               fill="tomato"
//               stroke="tomato"
//               className="absolute bottom-[1px] size-5 -rotate-[4deg] opacity-80"
//             />
//           </div>
//           <Title />
//         </div>
//         <Button
//           size="sm"
//           isIconOnly
//           radius="full"
//           color="secondary"
//           className="group bg-coal text-gray-400 hover:bg-coal"
//         >
//           <Icon
//             name="SidebarLeft"
//             className="size-6 stroke-coal group-hover:text-chalk"
//           />
//         </Button>
//       </div>

//       <section className="h-[calc(100vh-84px)] w-full space-y-2 overflow-y-scroll px-2">
//         <CardListItem
//           title="Harmony Space"
//           subtitle="Wellness & Yoga"
//           color="bg-warning"
//           isActive
//         />
//       </section>
//     </div>
//   </aside>
// );

// const Title = () => (
//   <h2 className="space-x-1">
//     <span className="font-lucky text-3xl font-black text-primary-200">BIG</span>
//     <span className="font-cherry text-3xl font-light text-primary-600">
//       ticket
//     </span>
//   </h2>
// );

// export const Partners = () => {
//   return (
//     <div className="flex h-fit items-center justify-center bg-coal pb-8 font-inter">
//       <ChineBorder
//         color={"#9ca3af"}
//         borderRadius={0}
//         borderWidth={0.66}
//         className="bg-gray-400"
//       >
//         <section className="flex w-full items-center justify-evenly bg-coal">
//           <div className="space-y-4 text-center">
//             {/* <p className="w-fit rounded-full bg-teal-400 px-3 py-1.5 text-lg font-medium tracking-tight text-white drop-shadow-sm xl:text-[18px] xl:text-xl">
//               {`Live events experience upgrade has arrived.`}
//             </p> */}
//             <h2 className="text-3xl font-bold leading-none tracking-tight text-chalk">
//               Our Partners
//             </h2>
//           </div>
//           <Clogo columns={4} />
//         </section>
//       </ChineBorder>
//     </div>
//   );
// };
