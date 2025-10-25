import React from "react";

export const CompassIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.485-7.485l-1.414 1.414M6.929 17.071L5.515 18.485m11.556 0l-1.414-1.414M6.929 6.929L5.515 5.515"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l3.536 3.536" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L8.464 8.464" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-10v4m2-2h-4m2 6.5l-1.5 1.5M18.5 15l1.5 1.5m-5-5l1.5 1.5m-1.5-1.5l-1.5-1.5"
    />
  </svg>
);

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      d="M18.5 2.5a1.5 1.5 0 00-3 0V11a1.5 1.5 0 00.5 1.125l1.5 1.25a1.5 1.5 0 002 0l1.5-1.25A1.5 1.5 0 0022 11V2.5a1.5 1.5 0 00-3.5 0zM4 2.5a1.5 1.5 0 00-3 0V11a1.5 1.5 0 00.5 1.125l1.5 1.25a1.5 1.5 0 002 0l1.5-1.25A1.5 1.5 0 007 11V2.5a1.5 1.5 0 00-3 0z"
      clipRule="evenodd"
      transform="translate(-2 -2.5)"
    />
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM9 4.5a1 1 0 00-1 1v1.732a1 1 0 00.5.866l1 1.732a1 1 0 101-1.732l-1-1.732A1 1 0 009 6.232V5.5a1 1 0 00-1-1v-.5z"
      clipRule="evenodd"
    />
    <path d="M10 12.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM6.5 17a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
  </svg>
);

export const LandmarkIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1zm5 2a1 1 0 011 1v12a1 1 0 11-2 0V5a1 1 0 011-1zm5 2a1 1 0 011 1v12a1 1 0 11-2 0V7a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const ActivityIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const BedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M1 5h18v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5zm14 2v2a1 1 0 11-2 0V7a1 1 0 112 0z" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
