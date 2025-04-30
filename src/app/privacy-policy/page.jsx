import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="relative min-h-screen bg-white dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-4xl font-semibold text-center">Privacy Policy</h1>
                <p className="text-lg text-center text-gray-300"><strong>Effective Date:</strong> [Insert Date]</p>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">1. Information We Collect</h3>
                    <p className="text-lg text-gray-200">
                        When you sign in with your Google account, we request access to the following information:
                    </p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li><strong>Google Profile Information:</strong> Basic profile details like your name, email address, and profile picture.</li>
                        <li><strong>Google Calendar Data:</strong> Access to create and delete events on your Google Calendar.</li>
                    </ul>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">2. How We Use Your Information</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        <li><strong>Authentication:</strong> To verify your identity when you sign in using your Google account.</li>
                        <li><strong>Event Creation:</strong> To create a new calendar event when a meeting is approved through our system.</li>
                        <li><strong>Event Deletion:</strong> Once the meeting is completed, the associated calendar event is automatically deleted.</li>
                    </ul>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">3. Data Sharing and Disclosure</h3>
                    <p className="text-lg text-gray-200">We do not share your personal information with third parties except in the following cases:</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li><strong>With Your Consent:</strong> If you explicitly allow us to share your data.</li>
                        <li><strong>Legal Compliance:</strong> To comply with applicable laws, such as responding to legal requests.</li>
                    </ul>
                    <p className="text-lg text-gray-200">We do <strong>not</strong> sell or rent your data to third parties for advertising purposes.</p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">4. Data Security</h3>
                    <p className="text-lg text-gray-200">
                        We implement industry-standard security measures to protect your data. All interactions with your Google Calendar are encrypted, and access is restricted to authorized personnel only.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">5. Accessing and Managing Your Data</h3>
                    <p className="text-lg text-gray-200">You have the right to:</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li><strong>Revoke Access:</strong> You can revoke our access to your Google data at any time by visiting <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-400">Google Account Permissions</a>.</li>
                        <li><strong>Request Deletion:</strong> If you wish to delete any data we have collected, you can contact us directly.</li>
                    </ul>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">6. Retention of Data</h3>
                    <p className="text-lg text-gray-200">
                        We will retain your data only as long as necessary to fulfill the purposes outlined above. Once the meeting is completed and the event is deleted, your data related to that event will no longer be retained.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">7. Cookies and Tracking Technologies</h3>
                    <p className="text-lg text-gray-200">
                        We may use cookies and tracking technologies to improve your experience. You can manage cookie preferences via your browser settings.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">8. Changes to This Privacy Policy</h3>
                    <p className="text-lg text-gray-200">
                        We may update this Privacy Policy from time to time. Any changes will be reflected on this page, with the updated "Effective Date." Continued use of our services after such changes constitutes your acceptance of the new Privacy Policy.
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-semibold">9. Contact Us</h3>
                    <p className="text-lg text-gray-200">
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <p className="text-lg text-gray-300"><strong>Email:</strong> [your@email.com]</p>
                    <p className="text-lg text-gray-300"><strong>Address:</strong> [Your Company Address]</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
