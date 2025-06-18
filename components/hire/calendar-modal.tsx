"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName?: string;
}

export default function CalendarModal({
  isOpen,
  onClose,
  applicantName,
}: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const currentMonth = "March 2025";
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const calendarDays = [
    { day: 23, isCurrentMonth: false },
    { day: 24, isCurrentMonth: false },
    { day: 25, isCurrentMonth: false },
    { day: 26, isCurrentMonth: false },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
    { day: 5, isCurrentMonth: false },
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-white">
        <div className="flex flex-col h-[90vh]">
          {/* Header */}
          <div className="px-8 pt-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">
              Schedule an Interview
            </DialogTitle>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="border-2 border-black rounded-lg m-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex gap-8">
                  {/* Left Panel */}
                  <div className="w-80 flex-shrink-0 space-y-4">
                    {/* Avatar */}
                    <div className="border-2 border-black rounded-xl p-6 bg-gray-50 flex items-center justify-center">
                      <span className="text-6xl">😊</span>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-3">
                      {timeSlots.slice(0, 6).map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          onClick={() => setSelectedTime(time)}
                          className={`w-full h-11 border-2 border-black text-base font-medium ${
                            selectedTime === time
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-gray-50"
                          }`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>

                    {/* Schedule Button */}
                    <Button
                      className="w-full h-11 border-2 border-black bg-gray-100 text-black hover:bg-gray-200 font-medium text-base"
                      disabled={!selectedDate || !selectedTime}
                    >
                      Schedule
                    </Button>
                  </div>

                  {/* Right Panel */}
                  <div className="flex-1 space-y-6">
                    {/* Calendar */}
                    <div className="border-2 border-black rounded-xl p-6 bg-white">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-6">
                        <Button variant="ghost" size="sm" className="p-2">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h4 className="text-xl font-bold">{currentMonth}</h4>
                        <Button variant="ghost" size="sm" className="p-2">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="space-y-2">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                          {daysOfWeek.map((day) => (
                            <div
                              key={day}
                              className="text-center py-2 font-semibold text-sm text-gray-600"
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-2">
                          {calendarDays.map((date, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                date.isCurrentMonth
                                  ? setSelectedDate(date.day)
                                  : null
                              }
                              className={`
                                h-10 w-10 text-center rounded-lg font-medium transition-colors text-sm
                                ${
                                  !date.isCurrentMonth
                                    ? "text-gray-300 cursor-not-allowed"
                                    : selectedDate === date.day
                                    ? "bg-black text-white"
                                    : "text-black hover:bg-gray-100 cursor-pointer"
                                }
                              `}
                              disabled={!date.isCurrentMonth}
                            >
                              {date.day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Available Times */}
                    {selectedDate && (
                      <div className="pb-4">
                        <h4 className="text-lg font-semibold mb-4">
                          Available Times
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              onClick={() => setSelectedTime(time)}
                              className={`h-10 text-sm font-medium ${
                                selectedTime === time
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer outside Calendly card */}
          <div className="px-8 py-4 border-t bg-gray-50 flex-shrink-0">
            <p className="text-center text-sm text-gray-600">
              Someone else taking the Interview?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Here's the Link!
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
