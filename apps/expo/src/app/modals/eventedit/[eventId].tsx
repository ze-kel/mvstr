import { useLocalSearchParams, useRouter } from "expo-router";

import type { IEditorHandler } from "~/app/home/create";
import { PageHeader } from "~/app/_components/layoutElements";
import { EventEditor, Steps } from "~/app/home/create";
import { api } from "~/utils/api";

const EditEvent = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data, isFetching } = api.events.get.useQuery(eventId || "", {
    refetchOnMount: false,
  });

  const m = api.events.update.useMutation();

  const router = useRouter();
  const utils = api.useUtils();

  const submitHandler: IEditorHandler = async ({
    title,
    type,
    place,
    date,
    description,
    image,
  }) => {
    if (!eventId) return;

    await m.mutateAsync({
      id: eventId,
      update: {
        name: title,
        type,
        place,
        date,
        description,
        image,
      },
    });
    await utils.events.list.invalidate();
    await utils.events.get.invalidate(eventId);

    router.dismiss();
    utils.events.list.invalidate();
  };

  return (
    <>
      <PageHeader title="Изменить мероприятие" />
      <EventEditor initial={data} submitHandler={submitHandler} />
    </>
  );
};

export default EditEvent;
