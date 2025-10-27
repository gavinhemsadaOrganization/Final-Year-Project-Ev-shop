const TearmsPage = () => {
    return (
        <>
            {/* It's better to apply global styles in your main CSS file or index.html,
                but for a single-file component, this works. The 'jsx' and 'global'
                attributes were removed to resolve the warning in standard React environments
                that don't use the styled-jsx library.
            */}
            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f9fafb; /* bg-gray-50 */
                    color: #1f2937; /* text-gray-800 */
                }
            `}</style>
            
            {/* The Google Font import should be in your main index.html file's <head> section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Terms and Conditions</h1>
                    <p className="mt-4 text-lg text-gray-600">Last updated: October 12, 2025</p>
                </header>

                <main className="bg-white p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to [Your EV Shop Name] ("we," "our," or "us"). These Terms and Conditions govern your use of our website [Your Website URL] (the "Site") and the purchase of electric vehicles (EVs), chargers, and accessories ("Products") from us. By accessing our Site or purchasing our Products, you agree to be bound by these Terms and Conditions. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Our Website</h2>
                        <p className="text-gray-700 leading-relaxed">
                            You agree to use our Site for lawful purposes only. You must not use our Site in any way that may cause damage to the Site, impair its availability, or in connection with any unlawful, fraudulent, or harmful activity. We reserve the right to restrict access to certain areas of our website, or indeed our whole website, at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We strive to provide accurate and up-to-date information on our Products, including descriptions, specifications, pricing, and availability. However, we do not warrant that the information is error-free, complete, or current. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice. Images on the site are for illustrative purposes only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Ordering and Payment</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By placing an order, you are offering to purchase a Product subject to these Terms and Conditions. All orders are subject to availability and confirmation of the order price.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We accept various payment methods as indicated on our Site. You agree to provide current, complete, and accurate purchase and account information for all purchases made. By providing payment information, you represent and warrant that you have the legal right to use the payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Shipping and delivery times are estimates only and cannot be guaranteed. We are not responsible for delays caused by shipping carriers or other circumstances beyond our control. The risk of loss and title for Products pass to you upon our delivery to the carrier. Shipping costs will be calculated and displayed at checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our Returns and Refunds Policy provides detailed information about options and procedures for returning your order. Please refer to our <a href="#" className="text-blue-600 hover:underline">Returns Policy</a> page for more information. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Warranty</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All new Products are sold with the manufacturer's warranty. The terms of the warranty can be found in the product documentation. For any warranty claims, please contact us, and we will guide you through the process. This warranty does not cover damage caused by misuse, accident, or unauthorized modification.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content on this Site, including text, graphics, logos, images, and software, is the property of [Your EV Shop Name] or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any content on this Site without our express written permission.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the fullest extent permitted by law, [Your EV Shop Name] shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Site; (b) any conduct or content of any third party on the Site; (c) any content obtained from the Site; and (d) unauthorized access, use, or alteration of your transmissions or content.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms and Conditions and any separate agreements whereby we provide you Products shall be governed by and construed in accordance with the laws of Sri Lanka.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms and Conditions</h2>
                         <p className="text-gray-700 leading-relaxed">
                            We reserve the right to update, change or replace any part of these Terms and Conditions by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Questions about the Terms and Conditions should be sent to us at:
                            <br />
                            <strong>[Your EV Shop Name]</strong>
                            <br />
                            [Your Address, e.g., 123 EV Way, Talduwa, Sri Lanka]
                            <br />
                            Email: [your-email@example.com]
                            <br />
                            Phone: [Your Phone Number]
                        </p>
                    </section>
                </main>
                
                <footer className="text-center mt-10">
                    <p className="text-sm text-gray-500">&copy; 2025 [Your EV Shop Name]. All Rights Reserved.</p>
                </footer>
            </div>
        </>
    );
};

export default TearmsPage;

