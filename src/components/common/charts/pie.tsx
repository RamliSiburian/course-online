import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
interface IPropsPie {
  data: any
}



export default function LynxPieChart(props: IPropsPie): React.JSX.Element {
  const [state, setState] = useState<number>(0)
  const [data, setData] = useState<any>(null)

  const onPieEnter = (_: any, index: number) => {
    setState(index);
  };

  useEffect(() => {
    const tempData = {
      title: props?.data?.title,
      hasil: {
        nilai: props?.data?.score,
        lulus: props?.data?.is_passed ? 'LL' : 'TL'
      },
      data: [
        { name: 'Benar', value: props?.data?.correct },
        { name: 'Dilewati', value: props?.data?.skipped },
        { name: 'Salah', value: props?.data?.wrong }
      ]
    }
    setData(tempData)
  }, [props?.data])

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill}>
          Nilai
        </text>
        <text x={cx} y={cy + 5} dy={8} textAnchor="middle" fill={fill}>
          {data?.hasil?.nilai} &nbsp;
          {`(${data?.hasil?.lulus})`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={500} height={500}>
        <Pie
          activeIndex={state}
          activeShape={renderActiveShape}
          data={data?.data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          fill="#ED7020"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}