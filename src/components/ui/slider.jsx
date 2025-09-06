import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { SendHorizontal } from 'lucide-react'

import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"

const Slider = React.forwardRef(({ className, ...props }, ref) => {
  // const {} = useSelector(state => state)
  
  return(
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb
      className="flex items-center justify-center h-8 w-8 p-1 border shadow-sm rounded-full bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ">
      <SendHorizontal className=" h-5 w-5 hover:cursor-pointer hover:scale-110 rotate-180 opacity-70 transition-opacity  duration-75  hover:opacity-100" />
    </SliderPrimitive.Thumb>

    <SliderPrimitive.Thumb
      className="flex items-center justify-center h-8 w-8 p-1 border shadow-sm rounded-full bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      <SendHorizontal className="h-5 w-5 hover:cursor-pointer hover:scale-110 opacity-70 duration-75   transition-opacity hover:opacity-100" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
)})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
