import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy - What we track and why | No Cap" },
      { name: "description", content: "The data we collect to run pool campaigns, how the tracked split metric works, retention windows, and how to request deletion." },
      { property: "og:title", content: "No Cap privacy policy" },
      { property: "og:description", content: "How brand and creator data flows through pool campaigns." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Privacy" title={<>Data, tracking, and the pool.</>} />
      <section className="nc-section">
        <div className="nc-wrap nc-prose">
          <h2>Preamble</h2>
          <p>With the following privacy policy we would like to inform you which types of your personal data (hereinafter also abbreviated as "Data") we process for which purposes and in which scope. This privacy statement applies to all processing of personal data carried out by No Cap (hereinafter referenced as "We" and "Us"), in the context of providing our services and in particular on our websites, and within external online presences, such as our social media profiles (hereinafter collectively referred to as "Online Services").</p>
          <p><strong>Last update:</strong> 25 July 2026</p>

          <h2>Controller</h2>
          <p>No Cap<br />Contact: <a href="mailto:legal@nocap.ink">legal@nocap.ink</a><br />Privacy inquiries: <a href="mailto:privacy@nocap.ink">privacy@nocap.ink</a></p>

          <h2>Overview of processing operations</h2>
          <p>The following summarises the types of data processed, the purposes for which they are processed, and the concerned data subjects.</p>
          <h3>Categories of processed data</h3>
          <ul>
            <li>Inventory data (e.g. names, brand/company).</li>
            <li>Contact data (e.g. email, phone numbers, social handles).</li>
            <li>Content data (e.g. campaign briefs, creator applications, posted content links, uploaded UGC).</li>
            <li>Usage data (e.g. pages visited, features used, access times).</li>
            <li>Meta/communication data (e.g. device information, IP addresses, browser type).</li>
            <li>Performance data (e.g. tracked clicks via UTMs, attributed conversions, verified views used to compute the pool split).</li>
            <li>Payment data (e.g. payout account identifiers processed by our payment providers; we do not store full card numbers).</li>
          </ul>
          <h3>Categories of data subjects</h3>
          <ul>
            <li>Prospective customers (DTC brands evaluating No Cap).</li>
            <li>Customers (brands running funded pool campaigns).</li>
            <li>Creators (applicants to and participants in pool campaigns).</li>
            <li>Communication partners (recipients of emails and support conversations).</li>
            <li>Users (website visitors and users of our Online Services).</li>
          </ul>
          <h3>Purposes of processing</h3>
          <ul>
            <li>Provision of our Online Services and usability.</li>
            <li>Provision of contractual services (running pool campaigns, computing splits, disbursing payouts) and customer support.</li>
            <li>Contact requests and communication.</li>
            <li>Office and organisational procedures.</li>
            <li>Security, fraud prevention, and abuse mitigation.</li>
            <li>Measurement of the effectiveness of campaigns (conversion tracking on the metric published in each brief).</li>
            <li>Direct marketing about our services where permitted.</li>
          </ul>

          <h2>Legal bases for the processing</h2>
          <p>Below is an overview of the GDPR legal bases on which we rely. Note that national data protection provisions of your or our country of residence or domicile may apply in addition to the GDPR. Where more specific legal bases apply in an individual case, we will inform you accordingly.</p>
          <ul>
            <li><strong>Consent</strong> (Art. 6 (1) (a) GDPR) - where you have given consent to the processing of your personal data for one or more specific purposes.</li>
            <li><strong>Performance of a contract and prior requests</strong> (Art. 6 (1) (b) GDPR) - where processing is necessary to perform a contract to which you are party or to take steps at your request prior to entering into a contract.</li>
            <li><strong>Legitimate interests</strong> (Art. 6 (1) (f) GDPR) - where processing is necessary for our legitimate interests or those of a third party, except where such interests are overridden by your interests or fundamental rights.</li>
          </ul>

          <h2>Transmission of personal data</h2>
          <p>In the context of our processing of personal data, data may be transferred to other places, companies or persons, or disclosed to them. Recipients may include, for example, service providers commissioned with IT tasks or providers of services and content embedded in our Online Services. In such cases, the legal requirements will be respected, and corresponding contracts or agreements protecting your data will be concluded with the recipients.</p>

          <h2>Data processing in third countries</h2>
          <p>If we process data in a third country (i.e. outside the European Union (EU) or the European Economic Area (EEA)) - including where processing takes place via third-party services or where data is disclosed or transferred to persons, bodies or companies outside the EEA - this will only take place in accordance with the legal requirements.</p>
          <p>Subject to your express consent or a transfer required by contract or law, we process data in third countries only where an adequate level of protection is recognised, on the basis of appropriate safeguards such as the European Commission's standard contractual clauses, or where certifications or binding corporate rules justify the processing (Art. 44 to 49 GDPR). You may contact us to obtain a copy of the safeguards for any transfer that affects you.</p>

          <h2>Erasure of data</h2>
          <p>The data processed by us will be erased in accordance with the statutory requirements as soon as their consent for processing is revoked or other authorisations no longer apply (e.g. if the purpose of processing this data no longer applies or if it is not required for the purpose). If the data is not erased because it is required for other and legally permitted purposes, its processing will be restricted, i.e. the data will be blocked and not processed for other purposes - for example, for tax and payout audit reasons.</p>

          <h2>Use of cookies</h2>
          <p>Cookies are small files stored on your device by your browser. We use cookies primarily to keep you signed in, to remember preferences (such as theme), and to secure the service. Where we use cookies that are not strictly necessary, we ask for your consent.</p>
          <ul>
            <li><strong>Necessary cookies</strong> - required to operate the service (e.g. authentication session, security).</li>
            <li><strong>Preference cookies</strong> - remember your settings and interface state.</li>
            <li><strong>Analytics cookies</strong> - help us measure how the site and product are used, on the basis of consent where required.</li>
          </ul>
          <p><strong>Retention:</strong> Unless we indicate otherwise (e.g. via a cookie banner), please assume permanent cookies can be stored for up to two years.</p>
          <p><strong>Opt-out:</strong> You can object to the use of cookies at any time by adjusting your browser settings or by revoking consent through our cookie preferences, where available. Disabling cookies may limit the functionality of our Online Services.</p>

          <h2>Provision of online services and web hosting</h2>
          <p>In order to provide our Online Services securely and efficiently, we use hosting providers from whose servers our Online Services are delivered. This may include infrastructure and platform services, computing capacity, storage, database services, and security and technical maintenance services. Data processed in this context may include any information relating to users of our Online Services collected during use and communication - in particular the IP address, which is required to deliver content to your browser.</p>
          <p><strong>Collection of access data and log files:</strong> We (or our hosting provider) collect data on the basis of each request to the server (server log files). Log files may include the URLs accessed, the date and time of access, data volumes transferred, notifications of successful access, browser type and version, operating system, referrer URL, and IP addresses. These are used for security purposes (e.g. mitigating abusive attacks such as DDoS) and to ensure the stability and load balancing of the service.</p>
          <p><strong>Services used:</strong> Our infrastructure is hosted on managed cloud providers, including Cloudflare (edge and serverless runtime) and Supabase (database, authentication and file storage). Data may be processed on servers located within the EEA and, subject to appropriate safeguards, in third countries.</p>

          <h2>Pool campaigns, creator payouts, and performance tracking</h2>
          <p>Running a No Cap campaign requires processing data about the brand funding the pool and the creators applying to and participating in it.</p>
          <ul>
            <li><strong>Brand campaign data</strong> - campaign brief, funded budget, baseline amount, tracked split metric, and approvals. Processed on the basis of Art. 6 (1) (b) GDPR (performance of contract).</li>
            <li><strong>Creator application data</strong> - profile handle, platform, followers/engagement information you choose to submit, and campaign eligibility signals. Processed on the basis of Art. 6 (1) (b) GDPR.</li>
            <li><strong>Performance signal</strong> - only the metric published on the campaign brief is used to compute the split (e.g. tracked clicks via UTMs, attributed conversions via a pixel the brand installs, or verified views via platform APIs). We do not repurpose this data for advertising, and we do not sell personal data.</li>
            <li><strong>Payout information</strong> - identifiers required by our payment processor to disburse creator earnings. Full financial credentials are handled by the payment provider, not stored on our servers.</li>
          </ul>
          <p><strong>Retention:</strong> Campaign, application and payout records are retained for the life of your account plus twelve (12) months, or longer where required by tax or accounting law.</p>

          <h2>Contacting us</h2>
          <p>When you contact us (e.g. by contact form, email, or via social media), your data is processed insofar as this is necessary to answer your enquiry and any requested activities. Responses to enquiries within the framework of contractual or pre-contractual relationships are made in order to fulfil our contractual obligations or to respond to (pre-)contractual enquiries, and otherwise on the basis of our legitimate interest in responding.</p>
          <ul>
            <li><strong>Processed data types:</strong> Contact data, content data.</li>
            <li><strong>Data subjects:</strong> Communication partners.</li>
            <li><strong>Purposes:</strong> Contact requests and communication.</li>
            <li><strong>Legal basis:</strong> Art. 6 (1) (b) GDPR, Art. 6 (1) (f) GDPR.</li>
          </ul>

          <h2>Cloud services</h2>
          <p>We use internet-accessible software services (so-called "cloud services", also referred to as "Software as a Service") provided on the servers of their providers for purposes including document storage and administration, e-mail delivery, spreadsheets and presentations, exchange of documents, content and information with specific recipients, and audio/video conferencing. Personal data may be processed and stored on the provider's servers insofar as it is part of communication processes with us or otherwise processed by us in accordance with this privacy policy.</p>

          <h2>Newsletter and electronic communications</h2>
          <p>If you subscribe to product updates or other communications, we send them on the basis of your consent or, where consent is not required, on the basis of our legitimate interests in direct marketing. Registration typically follows a double opt-in procedure: after signing up you receive a confirmation email, which is required to prevent registrations with third-party addresses. Registrations are logged (including login and confirmation times, and IP address) so we can demonstrate compliance.</p>
          <p>You can unsubscribe at any time via the link at the end of each communication or by contacting us.</p>

          <h2>Online marketing</h2>
          <p>Where we run marketing campaigns for No Cap, we may process personal data to display and measure the effectiveness of advertising content. This may involve creating pseudonymous user profiles stored in cookies. IP addresses, where processed, are shortened (IP masking) to protect your identity. We do not combine profile information with clear identifiers (such as your email address) unless you have consented.</p>
          <p>Where required, this processing takes place on the basis of your consent (Art. 6 (1) (a) GDPR).</p>

          <h2>Profiles in social networks (social media)</h2>
          <p>We maintain online presences within social networks and process user data in this context in order to communicate with users active there and to offer information about us. User data may be processed outside the European Union by the network providers, which may make it more difficult to enforce your rights.</p>
          <p>For a detailed description of the respective processing operations and opt-out options, please refer to the data protection information provided by the respective networks. Requests concerning data held by these providers can be pursued most effectively with the providers themselves; we are happy to help where we can.</p>

          <h2>Plugins and embedded functions and content</h2>
          <p>Within our Online Services, we integrate functional and content elements obtained from the servers of third-party providers - for example, web fonts. This integration requires the third-party provider to process your IP address in order to deliver the content to your browser.</p>
          <ul>
            <li><strong>Google Fonts</strong> - we integrate the web fonts "Instrument Serif", "Inter", and "IBM Plex Mono" from Google. Data is used solely to render fonts in the user's browser. Legal basis: legitimate interest in a technically secure, maintenance-free and consistent presentation of fonts.</li>
          </ul>

          <h2>Changes and updates to the privacy policy</h2>
          <p>Please review the contents of this privacy policy regularly. We will adjust it as changes in our data processing practices make necessary. We will inform you as soon as changes require your cooperation (e.g. consent) or other individual notification. If we provide addresses and contact information of companies and organizations in this privacy policy, please note that addresses may change over time and verify the information before contacting us.</p>

          <h2>Rights of data subjects</h2>
          <p>As a data subject, you are entitled to various rights under the GDPR, arising in particular from Articles 15 to 21:</p>
          <ul>
            <li><strong>Right to object</strong> - on grounds arising from your particular situation, you may object at any time to processing based on Art. 6 (1) (e) or (f) GDPR, including profiling. Where data is processed for direct marketing, you have the right to object at any time.</li>
            <li><strong>Right of withdrawal for consents</strong> - you may revoke consents at any time.</li>
            <li><strong>Right of access</strong> - you may request confirmation as to whether data concerning you is processed, information about that data, and a copy of it.</li>
            <li><strong>Right to rectification</strong> - you may request completion or correction of inaccurate data.</li>
            <li><strong>Right to erasure and restriction of processing</strong> - you may demand erasure or, alternatively, restriction of processing, in accordance with statutory provisions.</li>
            <li><strong>Right to data portability</strong> - you may receive data you provided to us in a structured, common and machine-readable format, or request its transmission to another controller.</li>
            <li><strong>Complaint to the supervisory authority</strong> - without prejudice to any other remedy, you may lodge a complaint with a data protection supervisory authority.</li>
          </ul>

          <h2>Terminology and definitions</h2>
          <p>This section provides an overview of the terms used in this privacy policy. Many are drawn from the law and defined mainly in Article 4 GDPR. The legal definitions are binding; the following explanations are for comprehension.</p>
          <ul>
            <li><strong>Controller</strong> - the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.</li>
            <li><strong>Conversion tracking</strong> - a method used to evaluate the effectiveness of marketing measures, typically via cookies stored on the user's device.</li>
            <li><strong>IP masking</strong> - a method by which parts of an IP address are removed so that the address alone can no longer uniquely identify a person.</li>
            <li><strong>Personal data</strong> - any information relating to an identified or identifiable natural person.</li>
            <li><strong>Processing</strong> - any operation performed on personal data, such as collection, evaluation, storage, transmission or erasure.</li>
            <li><strong>Profiles with user-related information</strong> - any automated processing of personal data used to analyse, evaluate or predict aspects relating to a natural person.</li>
          </ul>

          <h2>Contact us</h2>
          <p>If you have any questions about this privacy policy, you can contact us by email at <a href="mailto:privacy@nocap.ink">privacy@nocap.ink</a> or by visiting <a href="https://nocap.ink">nocap.ink</a>.</p>
        </div>
      </section>
    </SiteShell>
  );
}