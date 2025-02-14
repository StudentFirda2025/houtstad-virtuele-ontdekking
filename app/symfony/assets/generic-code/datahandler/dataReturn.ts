// export type messageReturn = {
//     message: string,
//     status: "failed" | "success"
// };

export type messageReturn = {
    status: string;  // Indicates "success" or "error"
    message?: string; // Optional: An error message or success message (can be used for user feedback)
};
