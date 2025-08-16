import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAccountProfileCtx } from "./ctx";
import { opts } from "@/utils/helpers";
import { Button, Spinner } from "@nextui-org/react";
import { Iconx } from "@/icons";

interface UserPfpProps {
  title: string;
}
export const PfpEditor = ({ title }: UserPfpProps) => {
  const { open, toggleEditor, preview, saveFn, saving } =
    useAccountProfileCtx();

  const ViewOptions = useCallback(() => {
    const options = opts(
      <CanvasWithZoom />,
      <Spinner size="sm" color="primary" />,
    );
    return <>{options.get(typeof preview === "string")}</>;
  }, [preview]);

  return (
    <SideVaul open={open} onOpenChange={toggleEditor} direction="right">
      <FlatWindow
        icon={"user-circle"}
        title={title}
        variant="god"
        closeFn={toggleEditor}
      >
        <div>
          <div className="flex h-[20rem] w-[24rem] items-center justify-center overflow-scroll bg-white dark:bg-void">
            <ViewOptions />
          </div>
        </div>
        <SideVaul.Footer>
          <div className="flex w-full items-center justify-end">
            <Button
              size="sm"
              onPress={saveFn}
              variant="solid"
              color="primary"
              isLoading={saving}
              className="text-orange-50"
            >
              Save Photo
              <Iconx
                name="cloud-upload"
                className="size-4 stroke-transparent text-orange-400"
              />
            </Button>
          </div>
        </SideVaul.Footer>
      </FlatWindow>
    </SideVaul>
  );
};

const CanvasWithZoom = () => {
  const { canvasRef } = useAccountProfileCtx();
  return (
    <TransformWrapper initialScale={1}>
      <TransformComponent>
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
      </TransformComponent>
    </TransformWrapper>
  );
};

// const TransformView = () => {
//   const {
//     preview,
//     isDragging,
//     handleDragEnd,
//     handleDragStart,
//     handleCanvasClick,
//     transformRef,
//     canvasRef,
//   } = use(AccountCtx)!;
//   const handleZoom = useCallback(
//     (zfn: VoidFunction) => () => {
//       zfn();
//     },
//     [],
//   );
//   return (
//     <TransformWrapper
//       ref={transformRef}
//       // initialScale={1}
//       // initialPositionX={0}
//       // initialPositionY={0}
//     >
//       {({ zoomIn, zoomOut }) => {
//         return (
//           <>
//             <TransformComponent
//               wrapperClass="!w-full !h-full"
//               contentClass={`!w-full !h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//             >
//               {/* <div className="flex h-full w-full items-center justify-center bg-gray-200"> */}
//               {preview ? (
//                 <canvas
//                   className="h-full w-full object-cover"
//                   onClick={handleCanvasClick}
//                   ref={canvasRef}
//                 />
//               ) : (
//                 // <Image
//                 //   src={preview}
//                 //   alt="User profile"
//                 //   className="h-full w-full object-cover"
//                 //   onMouseDown={handleDragStart}
//                 //   onMouseUp={handleDragEnd}
//                 //   onMouseLeave={handleDragEnd}
//                 // />
//                 <span className="text-gray-400">No image uploaded</span>
//               )}
//               {/* </div> */}
//             </TransformComponent>
//             {preview && (
//               <div className="absolute bottom-2 left-1/2 z-40 flex space-x-2 -translate-x-1/2 transform">
//                 <Icon
//                   onClick={handleZoom(zoomIn)}
//                   icon={MagnifyingGlassIcon}
//                 />

//                 <Icon
//                   onClick={handleZoom(zoomOut)}
//                   icon={MagnifyingGlassMinusIcon}
//                 />
//               </div>
//             )}
//           </>
//         );
//       }}
//     </TransformWrapper>
//   );
// };
