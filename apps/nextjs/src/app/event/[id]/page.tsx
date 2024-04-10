import { Sidebar } from "src/app/app/sidebar";
import { EventProvider } from "src/providers/eventProvider";

const EventPage = async ({ params }: { params: { id: string } }) => {
  return (
    <EventProvider id={params.id}>
      <div className="flex">
        <Sidebar />
        <div>Event with id {params.id}</div>
      </div>
    </EventProvider>
  );
};

export default EventPage;
