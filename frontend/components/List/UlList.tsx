export default function UlList({
  list,
  style1,
  style2,
  style3
}: {
  list: string[];
  style1: string;
  style2: string;
  style3: string;
}) {
  return (
    <div className={`${style1}`}>
      <ul
        className={`space-y-2 list-disc text-sm ${style2}`}
      >
        {list.map((item, index) => (
          <li className={style3} key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
