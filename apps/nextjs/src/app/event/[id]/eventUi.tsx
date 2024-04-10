import { UseEventQuery } from "src/helpers/useQueries";

const EventUi = ({ id }: { id: string }) => {
  const { data } = UseEventQuery(id);

  return (
    <div>
      Event {id}
      {JSON.stringify(data)}
    </div>
  );
};
