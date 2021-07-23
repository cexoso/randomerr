import React, { useRef, useState } from "react";

import "./datarow.css";

const addMinus = (arr: { number: number }[]) => {
  const l = arr.length;
  const needCount = Math.floor(l * 0.2);
  let i = 0;
  while (i < needCount) {
    const index = randInt(0, l - 1);
    if (arr[index] && arr[index].number > 0) {
      arr[index].number *= -1;
      i++;
    }
  }
};

const randInt = (fromIndex: number, toIndex: number) =>
  Math.floor(Math.random() * (toIndex + 1 - fromIndex)) + fromIndex;

const shuffle = (arr: any[]) => {
  const length = arr.length;
  /******** 区别只有这两行 ********/
  for (let i = 0; i < length; i++) {
    const targetIndex = randInt(i, length - 1);
    let tmp;
    tmp = arr[i];
    arr[i] = arr[targetIndex];
    arr[targetIndex] = tmp;
  }
};
const Row: React.FC<{ r: number }> = (props) => {
  const countInput = useRef<HTMLInputElement>(null);
  const qualifiedMinIput = useRef<HTMLInputElement>(null);
  const qualifiedMaxIput = useRef<HTMLInputElement>(null);
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const qualifiedCountInput = useRef<HTMLInputElement>(null);

  const [qpercent, setQpercent] = useState("");
  const [randomResult, setRandomResult] = useState<
    | {
        qualify: boolean;
        number: number;
      }[]
  >([]);

  const getValue = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current && ref.current.value) {
      const number = Number(ref.current.value);
      if (!Number.isNaN(number)) {
        return number;
      }
    }
  };
  const onChange = () => {
    const count = getValue(countInput);
    const qualifiedMin = getValue(qualifiedMinIput);
    const qualifiedMax = getValue(qualifiedMaxIput);
    const min = getValue(minInput);
    const max = getValue(maxInput);
    const qcount = getValue(qualifiedCountInput);
    if (qcount === undefined || count === undefined) {
      return;
    }
    if (qcount > count) {
      setQpercent("");
      return;
    }
    if (count === 0) {
      setQpercent("∞");
    } else {
      const qp = (qcount / count) * 100;
      setQpercent(String(parseFloat(qp.toFixed(5))) + "%");
    }

    let array = [];
    if (
      qualifiedMin === undefined ||
      qualifiedMax === undefined ||
      min === undefined ||
      max === undefined
    ) {
      return;
    }
    if (max <= min) {
      return;
    }
    if (qualifiedMax <= qualifiedMin) {
      return;
    }
    if (max < qualifiedMax && min > qualifiedMin) {
      return;
    }
    const less = count - qcount;
    for (let i = 0; i < qcount; i++) {
      array.push({
        qualify: true,
        number:
          Math.floor(Math.random() * (qualifiedMax + 1 - qualifiedMin)) +
          qualifiedMin,
      });
    }
    const getUnqRandom: () => number = () => {
      const r = Math.floor(Math.random() * (max + 1 - min)) + min;
      if (r >= qualifiedMin && r <= qualifiedMax) {
        return getUnqRandom();
      }
      return r;
    };
    for (let i = 0; i < less; i++) {
      array.push({
        qualify: false,
        number: getUnqRandom(),
      });
    }
    addMinus(array);
    shuffle(array);
    setRandomResult(array);
  };

  return (
    <>
      <tr className="title_row">
        <td rowSpan={2}>第{props.r}组</td>
        <td>生成个数</td>
        <td>合格标准</td>
        <td>可超出范围</td>
        <td>合格数个数</td>
        <td>合格率(%)=合格个数/生成数个数</td>
        <td>生成结果</td>
      </tr>
      <tr className="value_row">
        <td className="input_td">
          <input ref={countInput} className="input" onChange={onChange} />
        </td>
        <td className="input_td">
          [
          <input ref={qualifiedMinIput} className="input" onChange={onChange} />
          ,
          <input ref={qualifiedMaxIput} className="input" onChange={onChange} />
          ]
        </td>
        <td className="input_td">
          [
          <input ref={minInput} className="input" onChange={onChange} />
          ,
          <input ref={maxInput} className="input" onChange={onChange} />]
        </td>
        <td className="input_td">
          <input
            ref={qualifiedCountInput}
            className="input"
            onChange={onChange}
          />
        </td>
        <td className="input_td">{qpercent}</td>
        <td className="input_td">
          {randomResult.reduce((acc, value, key, all) => {
            acc.push(
              <span
                key={key}
                className={value.qualify ? "qualify" : "unqualify"}
              >
                {value.number}
              </span>
            );
            if (all[key + 1] !== undefined) {
              acc.push(<span key={key + "_,"}>,</span>);
            }
            return acc;
          }, [] as any)}
        </td>
      </tr>
    </>
  );
};
let r = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const DataRow = () => {
  return (
    <table className="table">
      <tbody>
        {r.map((value) => {
          return <Row key={value} r={value} />;
        })}
      </tbody>
    </table>
  );
};
