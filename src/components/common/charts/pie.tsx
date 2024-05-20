import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
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
        { name: 'Benar', value: props?.data?.correct, color: '#0000FF' },
        { name: 'Dilewati', value: props?.data?.skipped, color: '#ED7020' },
        { name: 'Salah', value: props?.data?.wrong, color: '#00FF00' }
      ]
    }
    setData(tempData)
  }, [props?.data])

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={'#000'}>
          Nilai
        </text>
        <text x={cx} y={cy + 5} dy={8} textAnchor="middle" fill={'#000'}>
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
    <PieChart width={250} height={250}>
      <Pie
        activeIndex={state}
        activeShape={renderActiveShape}
        data={data?.data}
        cx="50%"
        cy="40%"
        innerRadius={40}
        outerRadius={60}
        dataKey="value"
        onMouseEnter={onPieEnter}
      >
        {data?.data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  )
}