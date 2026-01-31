import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Loader } from "@/components/loader";
import { useParams } from "react-router-dom";
import { today } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert } from "@/components/ErrorAlert";
import BookingForm from "./_components/booking-form";
import EventDetails from "./_components/event-details";
import PageContainer from "./_components/page-container";
import { useBookingState } from "@/hooks/use-booking-state";
import BookingCalendar from "./_components/booking-calendar";
import { getSinglePublicEventBySlugQueryFn } from "@/lib/api";

const UserSingleEventPage = () => {
  const param = useParams();
  const username = param.username as string;
  const slug = param.slug as string;

  const { next, timezone, selectedDate } = useBookingState();

  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["public_single_event"],
    queryFn: () =>
      getSinglePublicEventBySlugQueryFn({
        username,
        slug,
      }),
  });

  const event = data?.event;

  return (
    <PageContainer
      isLoading={isLoading}
      className={cn(
        `min-w-auto! sm:w-auto!`,
        isFetching || isError ? "sm:min-w-[72%]!" : "",
        selectedDate && "sm:w-[98%]!"
      )}
    >
      {/* {Error Alert } */}
      <ErrorAlert isError={isError} error={error} />

      {isFetching || isError ? (
        <div className="flex items-center justify-center min-h-[15vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : (
        event && (
          <div className="w-full flex flex-col lg:flex-row items-stretch justify-stretch p-0 px-1">
            {/* {Event Details} */}
            <EventDetails
              eventTitle={event?.title}
              description={event?.description}
              user={event?.user}
              eventLocationType={event?.locationType}
              username={username || ""}
              duration={event?.duration}
            />
            {/* {Calendar & Booking form} */}
            {/* {Calendar & Booking form} */}
            <div className="min-w-sm max-w-3xl shrink-0 flex-1">
              {next ? (
                <Fragment>
                  {/* {Booking Form} */}
                  <BookingForm eventId={event.id} duration={event.duration} />
                </Fragment>
              ) : (
                <Fragment>
                  {/* {Booking Calendar} */}
                  <BookingCalendar
                    eventId={event.id}
                    minValue={today(timezone)}
                    defaultValue={today(timezone)}
                  />
                </Fragment>
              )}
            </div>
          </div>
        )
      )}
    </PageContainer>
  );
};

export default UserSingleEventPage;
