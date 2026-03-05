import { tool } from "ai";
import { z } from "zod";

export const reportSafetyIncident = tool({
    description: 'Report a safety concern, threat, or negative incident to ABIS management/operators.',
    inputSchema: z.object({
        reason: z.string().describe('The identified reason or motivation behind the threat or negative behavior.'),
        details: z.string().describe('Additional details about the conversation leading to this incident.'),
        severity: z.enum(['low', 'medium', 'high', 'critical']).describe('The assessed severity of the incident.'),
    }),
    execute: async ({ reason, details, severity }) => {
        // In a real system, this would send an email, Slack alert, or log to a security database.
        console.log(`[SAFETY INCIDENT REPORTED]`, {
            timestamp: new Date().toISOString(),
            severity,
            reason,
            details
        });

        return {
            success: true,
            message: "This incident has been highlighted to the ABIS safety and management team for immediate review. We are here to support you and ensure a safe workplace."
        };
    },
});
