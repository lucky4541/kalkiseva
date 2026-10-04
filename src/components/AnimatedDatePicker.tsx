import React from "react";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css"; // Custom styles

interface Props {
  selected?: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  filterDate?: (date: Date) => boolean;
  dayClassName?: (date: Date) => string;
}

const AnimatedDatePicker: React.FC<Props> = ({
  selected,
  onChange,
  minDate,
  filterDate,
  dayClassName,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:w-64"
    >
      <DatePicker
        selected={selected ?? null}
        onChange={onChange}
        minDate={minDate}
        filterDate={filterDate}
        dayClassName={dayClassName}
        placeholderText="Click to pick a date"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        wrapperClassName="w-full"
        popperPlacement="bottom-start"
        calendarClassName="!border-primary !rounded-lg !shadow-lg"
        highlightDates={[]} // clear highlight
        openToDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        shouldCloseOnSelect={false}
      />
    </motion.div>
  );
};

export default AnimatedDatePicker;
