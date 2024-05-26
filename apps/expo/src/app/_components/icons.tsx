import type { SvgProps } from "react-native-svg";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export const IconAll = React.forwardRef<Svg, SvgProps>(({ ...props }, ref) => {
  return (
    <Svg ref={ref} {...props}>
      <Path d="M5.833 0h-2.5A3.333 3.333 0 0 0 0 3.333v2.5a3.333 3.333 0 0 0 3.333 3.334h2.5a3.333 3.333 0 0 0 3.334-3.334v-2.5A3.333 3.333 0 0 0 5.833 0ZM16.666 0h-2.5a3.333 3.333 0 0 0-3.333 3.333v2.5a3.333 3.333 0 0 0 3.333 3.334h2.5A3.333 3.333 0 0 0 20 5.833v-2.5A3.333 3.333 0 0 0 16.666 0ZM5.833 10.833h-2.5A3.333 3.333 0 0 0 0 14.167v2.5A3.333 3.333 0 0 0 3.333 20h2.5a3.333 3.333 0 0 0 3.334-3.333v-2.5a3.333 3.333 0 0 0-3.334-3.334ZM16.666 10.833h-2.5a3.333 3.333 0 0 0-3.333 3.334v2.5A3.333 3.333 0 0 0 14.166 20h2.5A3.333 3.333 0 0 0 20 16.667v-2.5a3.333 3.333 0 0 0-3.334-3.334Z" />
    </Svg>
  );
});

export const IconTasks = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <Path d="M19.828 15a4.148 4.148 0 0 1-1.049 1.754l-2.025 2.025A4.15 4.15 0 0 1 15 19.828v-3.995c0-.46.374-.833.833-.833h3.995ZM20 4.167v9.166h-4.167a2.503 2.503 0 0 0-2.5 2.5V20H4.167A4.171 4.171 0 0 1 0 15.833V4.167A4.171 4.171 0 0 1 4.167 0h11.666A4.171 4.171 0 0 1 20 4.167ZM5.833 14.583a1.25 1.25 0 1 0-2.5.001 1.25 1.25 0 0 0 2.5 0Zm0-4.583a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Zm0-4.583a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z" />
      </Svg>
    );
  },
);

export const IconPlus = React.forwardRef<Svg, SvgProps>(({ ...props }, ref) => {
  return (
    <Svg ref={ref} {...props} viewBox="0 0 20 20">
      <Path d="M1.6 11.2a1.2 1.2 0 010-2.4h16.8a1.2 1.2 0 110 2.4H1.6z" />
      <Path d="M11.2 18.4a1.2 1.2 0 11-2.4 0V1.6a1.2 1.2 0 112.4 0v16.8z" />
    </Svg>
  );
});

export const IconPeople = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <G clipPath="url(#a)">
          <Path d="M6.25 10.833a3.75 3.75 0 1 1 0-7.499 3.75 3.75 0 0 1 0 7.5ZM11.667 20H.833A.833.833 0 0 1 0 19.167v-.417a6.25 6.25 0 0 1 12.5 0v.417a.833.833 0 0 1-.833.833Zm2.916-12.5a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5ZM13.4 9.184a5.687 5.687 0 0 0-3.891 2.36 7.948 7.948 0 0 1 4.095 4.29h5.564A.834.834 0 0 0 20 15v-.032a5.84 5.84 0 0 0-6.6-5.784Z" />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path d="M0 0h20v20H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  },
);

export const IconWishList = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <Path d="M18.327 17.64c-.012.13-.025.23-.04.277A2.918 2.918 0 0 1 15.493 20H5.2a3.73 3.73 0 0 0 .633-2.083c0-1.151.933-2.084 2.084-2.084h8.748c.975 0 1.75.836 1.66 1.807h.002ZM12.75 9.87l2.257-1.51 2.295 1.494a.835.835 0 0 0 1.245-.96l-.815-2.483 1.971-1.606a.834.834 0 0 0-.536-1.47h-2.501L15.78.85a.834.834 0 0 0-1.562 0l-.885 2.483h-2.5a.833.833 0 0 0-.539 1.469l1.98 1.611-.783 2.514a.835.835 0 0 0 1.258.943V9.87Zm3.083 2.573v1.724H7.918a3.753 3.753 0 0 0-3.751 3.754 2.085 2.085 0 0 1-2.342 2.064C.759 19.857 0 18.875 0 17.8V4.162C0 1.86 1.866 0 4.167 0h7.608a6.682 6.682 0 0 0-2.953 3.333H4.167a.833.833 0 1 0 0 1.667H8.39c-.034.273-.058.55-.058.833 0 .283.024.56.058.834H4.167a.833.833 0 1 0 0 1.666h4.655A6.665 6.665 0 0 0 15 12.5c.283 0 .56-.023.833-.057Zm-6.666-1.61A.833.833 0 0 0 8.333 10H4.167a.833.833 0 1 0 0 1.667h4.166c.46 0 .834-.373.834-.834Z" />
      </Svg>
    );
  },
);

export const IconCheck = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.689 4.274a1 1 0 01.038 1.414L8.241 15.715a.899.899 0 01-1.289.018l-4.66-4.663a1 1 0 011.414-1.414l3.57 3.573a.4.4 0 00.573-.008l8.427-8.908a.999.999 0 011.413-.04z"
        />
      </Svg>
    );
  },
);

export const IconChevronLeft = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <Path d="M9.13 10.295a.417.417 0 010-.59l3.822-3.82a1.25 1.25 0 10-1.767-1.77L7.363 7.938a2.92 2.92 0 000 4.125l3.822 3.822a1.25 1.25 0 001.768-1.768L9.13 10.295z" />
      </Svg>
    );
  },
);

export const IconCross = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} {...props} viewBox="0 0 20 20">
        <Path d="M2.293 16.293a1 1 0 001.414 1.414l6.01-6.01a.4.4 0 01.566 0l6.01 6.01a1 1 0 101.414-1.414l-6.01-6.01a.4.4 0 010-.566l6.01-6.01a1 1 0 10-1.414-1.414l-6.01 6.01a.4.4 0 01-.566 0l-6.01-6.01a1 1 0 10-1.414 1.414l6.01 6.01a.4.4 0 010 .566l-6.01 6.01z" />
      </Svg>
    );
  },
);

export const IconTime = React.forwardRef<Svg, SvgProps>(({ ...props }, ref) => {
  return (
    <Svg ref={ref} {...props} viewBox="0 0 20 20">
      <G clipPath="url(#clip0_191_2136)">
        <Path
          d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm2.083 13.608a.832.832 0 01-1.138-.305l-1.667-2.886A.83.83 0 019.167 10V5a.833.833 0 111.666 0v4.777l1.555 2.693a.834.834 0 01-.305 1.138z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_191_2136">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
});

export const IconStatusYes = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} viewBox="0 0 12 12" fill="none" {...props}>
        <Rect width={12} height={12} rx={4} fill="#21BA72" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.308 4.281a.3.3 0 01.012.425L5.474 7.714a.27.27 0 01-.387.005L3.69 6.32a.3.3 0 01.424-.424l1.071 1.072a.12.12 0 00.172-.003l2.528-2.672a.3.3 0 01.424-.012z"
          fill="#171619"
        />
      </Svg>
    );
  },
);
export const IconStatusMaybe = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} viewBox="0 0 12 12" fill="none" {...props}>
        <Rect width={12} height={12} rx={4} fill="#DC883A" />
        <G clipPath="url(#clip0_354_51950)" fill="#171619">
          <Path d="M5.996 3.5a2.508 2.508 0 011.78.75h-.78a.25.25 0 000 .5h1.036a.465.465 0 00.464-.464V3.25a.25.25 0 00-.25-.25.25.25 0 00-.25.25v.52A2.995 2.995 0 003.01 5.725a.252.252 0 00.25.275.245.245 0 00.247-.22 2.503 2.503 0 012.49-2.28zM8.738 6a.245.245 0 00-.247.22A2.496 2.496 0 014.22 7.75H5a.25.25 0 100-.5H3.964a.464.464 0 00-.464.464V8.75a.25.25 0 00.5 0v-.52a2.995 2.995 0 004.988-1.955.252.252 0 00-.25-.275z" />
        </G>
        <Defs>
          <ClipPath id="clip0_354_51950">
            <Path fill="#fff" transform="translate(3 3)" d="M0 0H6V6H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  },
);

export const IconStatusNo = React.forwardRef<Svg, SvgProps>(
  ({ ...props }, ref) => {
    return (
      <Svg ref={ref} viewBox="0 0 12 12" fill="none" {...props}>
        <Rect width={12} height={12} rx={4} fill="#DC3A3A" />
        <G clipPath="url(#clip0_354_51954)">
          <Path
            d="M6 3a3 3 0 100 6 3 3 0 000-6zm0 .5c.577 0 1.135.2 1.581.566L4.065 7.58A2.498 2.498 0 016 3.5zm0 5c-.577 0-1.135-.2-1.581-.566L7.935 4.42A2.498 2.498 0 016 8.5z"
            fill="#171619"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_354_51954">
            <Path fill="#fff" transform="translate(3 3)" d="M0 0H6V6H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  },
);

export const IconCopy = React.forwardRef<Svg, SvgProps>(({ ...props }, ref) => {
  return (
    <Svg viewBox="0 0 24 24" fill="currentColor" className="size-6" {...props}>
      <Path
        fillRule="evenodd"
        d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z"
        clipRule="evenodd"
      />
      <Path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
      <Path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
    </Svg>
  );
});
