"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatValue?: (value: number) => string;
  showTooltip?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, formatValue, showTooltip = false, ...props }, ref) => {
  const [hoveredThumb, setHoveredThumb] = React.useState<number | null>(null);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600" />
      </SliderPrimitive.Track>
      {props.value?.map((_, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            className="block h-5 w-5 rounded-full border-2 border-white bg-indigo-600 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onMouseEnter={() => setHoveredThumb(index)}
            onMouseLeave={() => setHoveredThumb(null)}
          />
          {showTooltip && hoveredThumb === index && formatValue && props.value && (
            <div className="absolute -top-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
              {formatValue(props.value[index])}
            </div>
          )}
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
