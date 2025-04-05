
import MeetingCard from "@/components/MeetingCard"
export default function UpcomingMeetings({ meetings = [], onReschedule }) {
    const sortedMeetings = [...meetings].sort(
        (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Meetings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedMeetings.map((meeting) => (
                    <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onReschedule={onReschedule}
                    />
                ))}
            </div>
        </div>
    );
}
