// // Calender.tsx

// import { useEffect, useRef } from "react";
// import uuid from "react-uuid";
// import { format, addMonths, startOfWeek, addDays } from "date-fns";
// import { endOfWeek, isSameDay, isSameMonth } from "date-fns";
// import { startOfMonth, endOfMonth } from "date-fns";
// import "../src/styles/components-schedule.style.scss";

// const RenderHeader = ({ currentMonth }) => {
//     return (
//         <div className="header row">
//             {currentMonth.toLocaleString("en-US", { month: "long" })}
//         </div>
//     );
// };

// const RenderDays = () => {
//     const days = [];
//     const date = ["Sun", "Mon", "Thu", "Wed", "Thrs", "Fri", "Sat"];
//     for (let i = 0; i < 7; i++) {
//         days.push(
//             <div className="col" key={i}>
//                 {date[i]}
//             </div>,
//         );
//     }
//     return <div className="days row">{days}</div>;
// };

// const RenderCells = ({ currentMonth, selectedDate }) => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);

//     const rows = [];
//     let days = [];
//     let day = startDate;
//     let formattedDate = "";

//     while (day <= endDate) {
//         for (let i = 0; i < 7; i++) {
//             formattedDate = format(day, "d");
//             days.push(
//                 <div
//                     className={`col cell ${
//                         !isSameMonth(day, monthStart)
//                             ? "disabled"
//                             : isSameDay(day, selectedDate)
//                             ? "selected"
//                             : "not-valid"
//                     }`}
//                     key={uuid()}
//                 >
//                     <span
//                         className={
//                             format(currentMonth, "M") !== format(day, "M")
//                                 ? "text not-valid"
//                                 : isSameMonth(day, monthStart) &&
//                                   isSameDay(day, selectedDate)
//                                 ? "text today"
//                                 : ""
//                         }
//                     >
//                         {formattedDate}
//                     </span>
//                 </div>,
//             );
//             day = addDays(day, 1);
//         }
//         rows.push(
//             <div className="row" key={uuid()}>
//                 {days}
//             </div>,
//         );
//         days = [];
//     }
//     return <div className="body">{rows}</div>;
// };

// export const Calender = () => {
//     const currentDate = new Date();
//     const selectedDate = new Date();

//     let currentMonth = new Date(format(currentDate, "yyyy"));
//     let months = [];

//     const monthRef = useRef<HTMLDivElement>(null);

//     for (let i = 0; i < 12; i++) {
//         months.push(
//             <div
//                 className="calendar__item"
//                 key={uuid()}
//                 ref={
//                     format(currentMonth, "MM") === format(selectedDate, "MM")
//                         ? monthRef
//                         : null
//                 }
//             >
//                 <RenderHeader currentMonth={currentMonth} />
//                 <RenderCells
//                     currentMonth={currentMonth}
//                     selectedDate={selectedDate}
//                 />
//             </div>,
//         );
//         currentMonth = addMonths(currentMonth, 1);
//     }

//     useEffect(() => {
//         if (monthRef.current !== null) {
//             monthRef.current.scrollIntoView({ behavior: "auto" });
//         }
//     }, []);

//     function scrollCurrentMonth() {
//         if (monthRef.current !== null) {
//             monthRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }

//     return (
//         <div className="schedule-calendar">
//             <div className="text-today">
//                 <p className="text-current" onClick={scrollCurrentMonth}>
//                     {currentDate.toLocaleString("en-US", { month: "long" })}
//                     {format(currentDate, " dd")}
//                 </p>
//                 <p className="text-year">{format(currentDate, " yyyy")}</p>
//             </div>
//             <RenderDays />
//             <div className="calendar-list">{months}</div>
//         </div>
//     );
// };