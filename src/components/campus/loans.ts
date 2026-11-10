/**
 * Third-party credit facility providers, as sot.upgrad.com's university pages
 * list them (read on 10 Nov 2026): each lender's terms and the notes under
 * them, verbatim. Shared by every campus page.
 */

/** a lender's terms: its loan types as columns, and per row one value each,
 *  or a single value that holds for every type */
export type Lender = {
  name: string;
  logo: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
};

export const LOANS = {
  intro:
    "Explore education loan options from various financial providers, featuring competitive rates and flexible repayment plans.",
  lenders: [
    {
      name: "ICICI Bank",
      logo: "/images/loans/icici.png",
      columns: ["Secured", "Unsecured"],
      rows: [
        {
          label: "Interest rate (%)",
          values: [
            "9.25% – 12.5% p.a. (floating, varies by profile/course)",
            "10.25% – 12.5% p.a.",
          ],
        },
        {
          label: "Max Loan Amount",
          values: [
            "Up to Rs. 1.5 crore (especially for overseas studies)",
            "Up to Rs. 1 crore",
          ],
        },
        {
          label: "Margin (College Fee portion to be borne by applicant)",
          values: ["NIL", "5%–15% margin"],
        },
        {
          label: "Tenure",
          values: [
            "up to 10–15 years post moratorium",
            "moratorium period (course duration + usually 6–12 months) before EMI repayment begins",
          ],
        },
        {
          label: "Processing Charges",
          values: [
            "Around 0.5% – 1% of loan amount + GST",
            "Minimum processing charges may apply for high-value loans",
          ],
        },
        { label: "Tax benefits under section 80E", values: ["Yes", "May Be"] },
      ],
    },
    {
      name: "PNB",
      logo: "/images/loans/pnb.png",
      columns: ["Secured", "Unsecured"],
      rows: [
        {
          label: "Interest rate (%)",
          values: ["7.25% – 10.25%", "9.25% – 11.25% p.a. (floating)"],
        },
        {
          label: "Max Loan Amount",
          values: [
            "Above Rs. 7.5L secured need-based",
            "Up to Rs. 7.5L unsecured",
          ],
        },
        {
          label: "Margin (College Fee portion to be borne by applicant)",
          values: ["0% – 15%"],
        },
        { label: "Tenure", values: ["Up to 15 years (after moratorium)"] },
        { label: "Processing Charges", values: ["NIL", "Up to 1% + GST"] },
        {
          label: "Tax benefits under section 80E",
          values: ["Yes – Interest Deduction"],
        },
      ],
    },
    {
      name: "IDFC FIRST Bank",
      logo: "/images/loans/idfc.png",
      columns: ["Secured", "Unsecured"],
      rows: [
        {
          label: "Interest rate (%)",
          values: ["9.5% – 10.5% p.a.", "10.0% – 11.5% p.a. (floating)"],
        },
        {
          label: "Max Loan Amount",
          values: ["Up to Rs. 2.0 Crore", "Up to Rs. 1.0 – Rs.1.5 Crore*"],
        },
        {
          label: "Margin (College Fee portion to be borne by applicant)",
          values: ["0% – 10%"],
        },
        { label: "Tenure", values: ["Up to 15 years", "Up to 12–15 years"] },
        {
          label: "Processing Charges",
          values: ["1.0% – 1.5% of loan amount + GST"],
        },
        { label: "Tax benefits under section 80E", values: ["Yes"] },
      ],
    },
    {
      name: "Propelld",
      logo: "/images/loans/propelld.png",
      columns: ["Details"],
      rows: [
        { label: "Interest rate (%)", values: ["11% – 14.5% p.a"] },
        { label: "Max Loan Amount", values: ["Maximum upto 40 L"] },
        {
          label: "Margin (College Fee portion to be borne by applicant)",
          values: ["0% – 10%"],
        },
        { label: "Tenure", values: ["Up to 10 Years"] },
        { label: "Processing Charges", values: ["0% – 3%"] },
        { label: "Tax benefits under section 80E", values: ["Yes"] },
      ],
    },
  ] satisfies Lender[],
  notes: [
    "Loan, No Cost EMI, and Credit Card EMI options are offered by third-party credit facility providers. uGSOT does not provide, underwrite, or influence any credit facility.",
    "Interest rates, eligibility, approval, and all applicable terms are determined solely by the respective third-party credit facility provider, and loan approval is subject to the applicant meeting the provider’s prescribed eligibility criteria and internal assessment parameters.",
    "Processing charges, fees, and repayment terms may vary based on the loan amount and applicant profile.",
    "Terms and conditions are subject to change at the discretion of the by third-party credit facility provider without prior notice.",
    "Applicants are advised to independently verify all details, terms, and conditions with the respective service provider before proceeding.",
  ],
};
