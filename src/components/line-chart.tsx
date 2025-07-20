import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ComponentType,
  type Dispatch,
  type ElementType,
  Fragment,
  forwardRef,
  type HTMLAttributes,
  type OlHTMLAttributes,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CartesianGrid,
  Dot,
  Label,
  Line,
  Legend as RechartsLegend,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AxisDomain } from "recharts/types/util/types";
import { useOnWindowResize } from "@/hooks/use-on-window-resize";
import {
  AvailableChartColors,
  type AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from "@/lib/chart-utils";
import { cn } from "@/lib/utils";

//#region Legend

interface LegendItemProps {
  name: string;
  color: AvailableChartColorsKeys;
  onClick?: (name: string, color: AvailableChartColorsKeys) => void;
  activeLegend?: string;
}

const LegendItem = ({
  name,
  color,
  onClick,
  activeLegend,
}: LegendItemProps) => {
  const hasOnValueChange = !!onClick;
  return (
    <li
      className={cn(
        // base
        "group inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 transition",
        hasOnValueChange
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          : "cursor-default"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(name, color);
      }}
    >
      <span
        aria-hidden={true}
        className={cn(
          "h-[3px] w-3.5 shrink-0 rounded-full",
          getColorClassName(color, "bg"),
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100"
        )}
      />
      <p
        className={cn(
          // base
          "truncate whitespace-nowrap text-xs",
          // text color
          "text-gray-700 dark:text-gray-300",
          hasOnValueChange &&
            "group-hover:text-gray-900 dark:group-hover:text-gray-50",
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100"
        )}
      >
        {name}
      </p>
    </li>
  );
};

interface ScrollButtonProps {
  icon: ElementType;
  onClick?: () => void;
  disabled?: boolean;
}

const ScrollButton = ({ icon, onClick, disabled }: ScrollButtonProps) => {
  const Icon = icon;
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.();
      }, 300);
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isPressed, onClick]);

  useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <button
      className={cn(
        // base
        "group inline-flex size-5 items-center truncate rounded-sm transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setIsPressed(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setIsPressed(false);
      }}
      type="button"
    >
      <Icon aria-hidden="true" className="size-full" />
    </button>
  );
};

interface LegendProps extends OlHTMLAttributes<HTMLOListElement> {
  categories: string[];
  colors?: AvailableChartColorsKeys[];
  onClickLegendItem?: (category: string, color: string) => void;
  activeLegend?: string;
  enableLegendSlider?: boolean;
}

type HasScrollProps = {
  left: boolean;
  right: boolean;
};

const Legend = forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
  const {
    categories,
    colors = AvailableChartColors,
    className,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    ...other
  } = props;
  const scrollableRef = useRef<HTMLInputElement>(null);
  const scrollButtonsRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState<HasScrollProps | null>(null);
  const [isKeyDowned, setIsKeyDowned] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = useCallback(() => {
    const scrollable = scrollableRef?.current;
    if (!scrollable) {
      return;
    }

    const hasLeftScroll = scrollable.scrollLeft > 0;
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

    setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
  }, []);

  const scrollToTest = useCallback(
    (direction: "left" | "right") => {
      const element = scrollableRef?.current;
      const scrollButtons = scrollButtonsRef?.current;
      const scrollButtonsWith = scrollButtons?.clientWidth ?? 0;
      const width = element?.clientWidth ?? 0;

      if (element && enableLegendSlider) {
        element.scrollTo({
          left:
            direction === "left"
              ? element.scrollLeft - width + scrollButtonsWith
              : element.scrollLeft + width - scrollButtonsWith,
          behavior: "smooth",
        });
        setTimeout(() => {
          checkScroll();
        }, 400);
      }
    },
    [enableLegendSlider, checkScroll]
  );

  useEffect(() => {
    const keyDownHandler = (key: string) => {
      if (key === "ArrowLeft") {
        scrollToTest("left");
      } else if (key === "ArrowRight") {
        scrollToTest("right");
      }
    };
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned);
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned);
      }, 300);
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isKeyDowned, scrollToTest]);

  const keyDown = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setIsKeyDowned(e.key);
    }
  }, []);

  const keyUp = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    setIsKeyDowned(null);
  }, []);

  useEffect(() => {
    const scrollable = scrollableRef?.current;
    if (enableLegendSlider) {
      checkScroll();
      scrollable?.addEventListener("keydown", keyDown);
      scrollable?.addEventListener("keyup", keyUp);
    }

    return () => {
      scrollable?.removeEventListener("keydown", keyDown);
      scrollable?.removeEventListener("keyup", keyUp);
    };
  }, [checkScroll, enableLegendSlider, keyDown, keyUp]);

  return (
    <ol
      className={cn("relative overflow-hidden", className)}
      ref={ref}
      {...other}
    >
      <div
        className={cn(
          "flex h-full",
          enableLegendSlider
            ? hasScroll?.right || hasScroll?.left
              ? "snap-mandatory items-center overflow-auto pr-12 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : ""
            : "flex-wrap"
        )}
        ref={scrollableRef}
        tabIndex={0}
      >
        {categories.map((category, index) => (
          <LegendItem
            activeLegend={activeLegend}
            color={colors[index] as AvailableChartColorsKeys}
            key={`item-${index}`}
            name={category}
            onClick={onClickLegendItem}
          />
        ))}
      </div>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <div
          className={cn(
            // base
            "absolute top-0 right-0 bottom-0 flex h-full items-center justify-center pr-1",
            // background color
            "bg-white dark:bg-gray-950"
          )}
        >
          <ScrollButton
            disabled={!hasScroll?.left}
            icon={ChevronLeft}
            onClick={() => {
              setIsKeyDowned(null);
              scrollToTest("left");
            }}
          />
          <ScrollButton
            disabled={!hasScroll?.right}
            icon={ChevronRight}
            onClick={() => {
              setIsKeyDowned(null);
              scrollToTest("right");
            }}
          />
        </div>
      ) : null}
    </ol>
  );
});

Legend.displayName = "Legend";

const ChartLegend = (
  { payload }: any,
  categoryColors: Map<string, AvailableChartColorsKeys>,
  setLegendHeight: Dispatch<SetStateAction<number>>,
  activeLegend: string | undefined,
  onClick?: (category: string, color: string) => void,
  enableLegendSlider?: boolean,
  legendPosition?: "left" | "center" | "right",
  yAxisWidth?: number
) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height ? Number(height) + 15 : 60;
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  const legendPayload = payload.filter((item: any) => item.type !== "none");

  const paddingLeft =
    legendPosition === "left" && yAxisWidth ? yAxisWidth - 8 : 0;

  return (
    <div
      className={cn(
        "flex items-center",
        { "justify-center": legendPosition === "center" },
        { "justify-start": legendPosition === "left" },
        { "justify-end": legendPosition === "right" }
      )}
      ref={legendRef}
      style={{ paddingLeft }}
    >
      <Legend
        activeLegend={activeLegend}
        categories={legendPayload.map((entry: any) => entry.value)}
        colors={legendPayload.map((entry: any) =>
          categoryColors.get(entry.value)
        )}
        enableLegendSlider={enableLegendSlider}
        onClickLegendItem={onClick}
      />
    </div>
  );
};

//#region Tooltip

type TooltipProps = Pick<ChartTooltipProps, "active" | "payload" | "label">;

type PayloadItem = {
  category: string;
  value: number;
  index: string;
  color: AvailableChartColorsKeys;
  type?: string;
  payload: any;
};

interface ChartTooltipProps {
  active: boolean | undefined;
  payload: PayloadItem[];
  label: string;
  valueFormatter: (value: number) => string;
}

const ChartTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const legendPayload = payload.filter((item: any) => item.type !== "none");
    return (
      <div
        className={cn(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950"
        )}
      >
        <div className={cn("border-inherit border-b px-4 py-2")}>
          <p
            className={cn(
              // base
              "font-medium",
              // text color
              "text-gray-900 dark:text-gray-50"
            )}
          >
            {label}
          </p>
        </div>
        <div className={cn("space-y-1 px-4 py-2")}>
          {legendPayload.map(({ value, category, color }, index) => (
            <div
              className="flex items-center justify-between space-x-8"
              key={`id-${index}`}
            >
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-[3px] w-3.5 shrink-0 rounded-full",
                    getColorClassName(color, "bg")
                  )}
                />
                <p
                  className={cn(
                    // base
                    "whitespace-nowrap text-right",
                    // text color
                    "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {category}
                </p>
              </div>
              <p
                className={cn(
                  // base
                  "whitespace-nowrap text-right font-medium tabular-nums",
                  // text color
                  "text-gray-900 dark:text-gray-50"
                )}
              >
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

//#region LineChart

interface ActiveDot {
  index?: number;
  dataKey?: string;
}

type BaseEventProps = {
  eventType: "dot" | "category";
  categoryClicked: string;
  [key: string]: number | string;
};

type LineChartEventProps = BaseEventProps | null | undefined;

interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[];
  index: string;
  categories: string[];
  colors?: AvailableChartColorsKeys[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  yAxisWidth?: number;
  intervalType?: "preserveStartEnd" | "equidistantPreserveStart";
  showTooltip?: boolean;
  showLegend?: boolean;
  autoMinValue?: boolean;
  minValue?: number;
  maxValue?: number;
  allowDecimals?: boolean;
  onValueChange?: (value: LineChartEventProps) => void;
  enableLegendSlider?: boolean;
  tickGap?: number;
  connectNulls?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legendPosition?: "left" | "center" | "right";
  tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void;
  customTooltip?: ComponentType<TooltipProps>;
}

const LineChart = forwardRef<HTMLDivElement, LineChartProps>((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    colors = AvailableChartColors,
    valueFormatter = (value: number) => value.toString(),
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    showGridLines = true,
    yAxisWidth = 56,
    intervalType = "equidistantPreserveStart",
    showTooltip = true,
    showLegend = true,
    autoMinValue = false,
    minValue,
    maxValue,
    allowDecimals = true,
    connectNulls = false,
    className,
    onValueChange,
    enableLegendSlider = false,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    legendPosition = "right",
    tooltipCallback,
    customTooltip,
    ...other
  } = props;
  const CustomTooltip = customTooltip;
  const paddingValue =
    !(showXAxis || showYAxis) || (startEndOnly && !showYAxis) ? 0 : 20;
  const [legendHeight, setLegendHeight] = useState(60);
  const [activeDot, setActiveDot] = useState<ActiveDot | undefined>(undefined);
  const [activeLegend, setActiveLegend] = useState<string | undefined>(
    undefined
  );
  const categoryColors = constructCategoryColors(categories, colors);

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
  const hasOnValueChange = !!onValueChange;
  const prevActiveRef = useRef<boolean | undefined>(undefined);
  const prevLabelRef = useRef<string | undefined>(undefined);

  function onDotClick(itemData: any, event: MouseEvent) {
    event.stopPropagation();

    if (!hasOnValueChange) return;
    if (
      (itemData.index === activeDot?.index &&
        itemData.dataKey === activeDot?.dataKey) ||
      (hasOnlyOneValueForKey(data, itemData.dataKey) &&
        activeLegend &&
        activeLegend === itemData.dataKey)
    ) {
      setActiveLegend(undefined);
      setActiveDot(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(itemData.dataKey);
      setActiveDot({
        index: itemData.index,
        dataKey: itemData.dataKey,
      });
      onValueChange?.({
        eventType: "dot",
        categoryClicked: itemData.dataKey,
        ...itemData.payload,
      });
    }
  }

  function onCategoryClick(dataKey: string) {
    if (!hasOnValueChange) return;
    if (
      (dataKey === activeLegend && !activeDot) ||
      (hasOnlyOneValueForKey(data, dataKey) &&
        activeDot &&
        activeDot.dataKey === dataKey)
    ) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        eventType: "category",
        categoryClicked: dataKey,
      });
    }
    setActiveDot(undefined);
  }

  return (
    <div
      className={cn("h-80 w-full", className)}
      ref={ref}
      tremor-id="tremor-raw"
      {...other}
    >
      <ResponsiveContainer>
        <RechartsLineChart
          data={data}
          margin={{
            bottom: xAxisLabel ? 30 : undefined,
            left: yAxisLabel ? 20 : undefined,
            right: yAxisLabel ? 5 : undefined,
            top: 5,
          }}
          onClick={
            hasOnValueChange && (activeLegend || activeDot)
              ? () => {
                  setActiveDot(undefined);
                  setActiveLegend(undefined);
                  onValueChange?.(null);
                }
              : undefined
          }
        >
          {showGridLines ? (
            <CartesianGrid
              className={cn("stroke-1 stroke-gray-200 dark:stroke-gray-800")}
              horizontal={true}
              vertical={false}
            />
          ) : null}
          <XAxis
            axisLine={false}
            className={cn(
              // base
              "text-xs",
              // text fill
              "fill-gray-500 dark:fill-gray-500"
            )}
            dataKey={index}
            fill=""
            hide={!showXAxis}
            interval={startEndOnly ? "preserveStartEnd" : intervalType}
            minTickGap={tickGap}
            padding={{ left: paddingValue, right: paddingValue }}
            stroke=""
            tick={{ transform: "translate(0, 6)" }}
            tickLine={false}
            ticks={
              startEndOnly
                ? [data[0][index], data[data.length - 1][index]]
                : undefined
            }
          >
            {xAxisLabel && (
              <Label
                className="fill-gray-800 font-medium text-sm dark:fill-gray-200"
                offset={-20}
                position="insideBottom"
              >
                {xAxisLabel}
              </Label>
            )}
          </XAxis>
          <YAxis
            allowDecimals={allowDecimals}
            axisLine={false}
            className={cn(
              // base
              "text-xs",
              // text fill
              "fill-gray-500 dark:fill-gray-500"
            )}
            domain={yAxisDomain as AxisDomain}
            fill=""
            hide={!showYAxis}
            stroke=""
            tick={{ transform: "translate(-3, 0)" }}
            tickFormatter={valueFormatter}
            tickLine={false}
            type="number"
            width={yAxisWidth}
          >
            {yAxisLabel && (
              <Label
                angle={-90}
                className="fill-gray-800 font-medium text-sm dark:fill-gray-200"
                offset={-15}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              >
                {yAxisLabel}
              </Label>
            )}
          </YAxis>
          <Tooltip
            animationDuration={100}
            content={({ active, payload, label }) => {
              const cleanPayload: TooltipProps["payload"] = payload
                ? payload.map((item: any) => ({
                    category: item.dataKey,
                    value: item.value,
                    index: item.payload[index],
                    color: categoryColors.get(
                      item.dataKey
                    ) as AvailableChartColorsKeys,
                    type: item.type,
                    payload: item.payload,
                  }))
                : [];

              if (
                tooltipCallback &&
                (active !== prevActiveRef.current ||
                  label !== prevLabelRef.current)
              ) {
                tooltipCallback({ active, payload: cleanPayload, label });
                prevActiveRef.current = active;
                prevLabelRef.current = label;
              }

              return showTooltip && active ? (
                CustomTooltip ? (
                  <CustomTooltip
                    active={active}
                    label={label}
                    payload={cleanPayload}
                  />
                ) : (
                  <ChartTooltip
                    active={active}
                    label={label}
                    payload={cleanPayload}
                    valueFormatter={valueFormatter}
                  />
                )
              ) : null;
            }}
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
            isAnimationActive={true}
            offset={20}
            position={{ y: 0 }}
            wrapperStyle={{ outline: "none" }}
          />

          {showLegend ? (
            <RechartsLegend
              content={({ payload }) =>
                ChartLegend(
                  { payload },
                  categoryColors,
                  setLegendHeight,
                  activeLegend,
                  hasOnValueChange
                    ? (clickedLegendItem: string) =>
                        onCategoryClick(clickedLegendItem)
                    : undefined,
                  enableLegendSlider,
                  legendPosition,
                  yAxisWidth
                )
              }
              height={legendHeight}
              verticalAlign="top"
            />
          ) : null}
          {categories.map((category) => (
            <Line
              activeDot={(props: any) => {
                const {
                  cn: cnCoord,
                  cy: cyCoord,
                  stroke,
                  strokeLinecap,
                  strokeLinejoin,
                  strokeWidth,
                  dataKey,
                } = props;
                return (
                  <Dot
                    className={cn(
                      "stroke-white dark:stroke-gray-950",
                      onValueChange ? "cursor-pointer" : "",
                      getColorClassName(
                        categoryColors.get(dataKey) as AvailableChartColorsKeys,
                        "fill"
                      )
                    )}
                    cn={cnCoord}
                    cy={cyCoord}
                    fill=""
                    onClick={(_, event) => onDotClick(props, event)}
                    r={5}
                    stroke={stroke}
                    strokeLinecap={strokeLinecap}
                    strokeLinejoin={strokeLinejoin}
                    strokeWidth={strokeWidth}
                  />
                );
              }}
              className={cn(
                getColorClassName(
                  categoryColors.get(category) as AvailableChartColorsKeys,
                  "stroke"
                )
              )}
              connectNulls={connectNulls}
              dataKey={category}
              dot={(props: any) => {
                const {
                  stroke,
                  strokeLinecap,
                  strokeLinejoin,
                  strokeWidth,
                  cn: cnCoord,
                  cy: cyCoord,
                  dataKey,
                  index,
                } = props;

                if (
                  (hasOnlyOneValueForKey(data, category) &&
                    !(
                      activeDot ||
                      (activeLegend && activeLegend !== category)
                    )) ||
                  (activeDot?.index === index &&
                    activeDot?.dataKey === category)
                ) {
                  return (
                    <Dot
                      className={cn(
                        "stroke-white dark:stroke-gray-950",
                        onValueChange ? "cursor-pointer" : "",
                        getColorClassName(
                          categoryColors.get(
                            dataKey
                          ) as AvailableChartColorsKeys,
                          "fill"
                        )
                      )}
                      cx={cnCoord}
                      cy={cyCoord}
                      fill=""
                      key={index}
                      r={5}
                      stroke={stroke}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      strokeWidth={strokeWidth}
                    />
                  );
                }
                return <Fragment key={index} />;
              }}
              isAnimationActive={false}
              key={category}
              name={category}
              stroke=""
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={
                activeDot || (activeLegend && activeLegend !== category)
                  ? 0.3
                  : 1
              }
              strokeWidth={2}
              type="linear"
            />
          ))}
          {/* hidden lines to increase clickable target area */}
          {onValueChange
            ? categories.map((category) => (
                <Line
                  className={cn("cursor-pointer")}
                  connectNulls={connectNulls}
                  dataKey={category}
                  fill="transparent"
                  key={category}
                  legendType="none"
                  name={category}
                  onClick={(props: any, event) => {
                    event.stopPropagation();
                    const { name } = props;
                    onCategoryClick(name);
                  }}
                  stroke="transparent"
                  strokeOpacity={0}
                  strokeWidth={12}
                  tooltipType="none"
                  type="linear"
                />
              ))
            : null}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChart.displayName = "LineChart";

export { LineChart, type LineChartEventProps, type TooltipProps };
