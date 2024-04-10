import { EventProvider } from "~/app/_components/eventProvider";
import { Sidebar } from "~/app/_components/sidebar";
import { EventUi } from "~/app/event/[id]/eventUi";

const EventPage = ({ params }: { params: { id: string } }) => {
  return (
    <EventProvider id={params.id}>
      <div className="flex">
        <EventUi id={params.id} />
        <div>Event with id {params.id}</div>
      </div>
    </EventProvider>
  );
};

export default EventPage;
