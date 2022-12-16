export default function ReviewSelect({
  selectChange,
}: {
  selectChange: (value: string) => void;
}) {
  const handleChange = (value: string) => {
    selectChange(value);
  };

  return (
    <>
      <form>
        <select onChange={(e) => handleChange(e.target.value)}>
          <option value="reviewId&_order=desc">新着順</option>
          <option value="evaluation&_order=desc">評価の高い順</option>
          <option value="evaluation&_order=asc">評価の低い順</option>
        </select>
      </form>
    </>
  );
}
