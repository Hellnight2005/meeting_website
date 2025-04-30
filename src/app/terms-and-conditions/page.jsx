import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="relative min-h-screen bg-white dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-4xl font-semibold text-center">Terms and Conditions</h1>
                <p className="text-lg text-center text-gray-300"><strong>Effective Date:</strong> [Insert Date]</p>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">1. Use of Google User Data</h3>
                    <p className="text-lg text-gray-200">
                        When you sign in with your Google account, we request the following data:
                    </p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li><strong>Profile Information:</strong> Your name, email address, and profile picture.</li>
                        <li><strong>Google Calendar Data:</strong> We request access to create and delete events on your Google Calendar.</li>
                    </ul>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">2. Event Creation and Deletion</h3>
                    <p className="text-lg text-gray-200">
                        - <strong>Event Creation:</strong> When a meeting is approved within our system, a corresponding event will automatically be created on your Google Calendar.
                    </p>
                    <p className="text-lg text-gray-200">
                        - <strong>Event Deletion:</strong> Once the meeting is completed, the associated calendar event will be automatically deleted.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">3. User Responsibilities</h3>
                    <p className="text-lg text-gray-200">You agree to:</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>Provide accurate and up-to-date information when using our services.</li>
                        <li>Use the services in a lawful manner and comply with these Terms.</li>
                        <li>Not misuse the access to your Google Calendar data.</li>
                    </ul>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">4. Revocation of Access</h3>
                    <p className="text-lg text-gray-200">
                        You can revoke access to your Google data at any time by visiting the
                        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-400">
                            Google Permissions page
                        </a>.
                    </p>
                    <p className="text-lg text-gray-200">
                        Once revoked, we will no longer be able to access or delete events on your Google Calendar.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">5. Modifications to Terms</h3>
                    <p className="text-lg text-gray-200">
                        We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an updated "Effective Date." Continued use of our services after any changes constitutes your acceptance of the updated Terms.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">6. Contact Us</h3>
                    <p className="text-lg text-gray-200">
                        If you have any questions or concerns about these Terms and Conditions, please contact us at:
                    </p>
                    <p className="text-lg text-gray-300"><strong>Email:</strong> [your@email.com]</p>
                    <p className="text-lg text-gray-300"><strong>Address:</strong> [Your Company Address]</p>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditions;
