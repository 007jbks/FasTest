export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Terms & Policies
        </h1>

        <p className="text-gray-300 mb-8 text-center">
          The following policies outline acceptable use of this platform.
        </p>

        <div className="space-y-6 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              1. No Harmful Content
            </h2>
            <p>
              Users must not upload, submit, or distribute content that is
              harmful, abusive, hateful, discriminatory, or threatening in
              nature. Any attempt to promote violence, harassment, or illegal
              activity is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. No Illegal Activities
            </h2>
            <p>
              The platform may not be used to engage in or facilitate any
              illegal activity — including but not limited to hacking attempts,
              fraud, unauthorized access, or content that violates local or
              international laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Respect Privacy & Data
            </h2>
            <p>
              Users should not attempt to collect or exploit sensitive data of
              others. Any information submitted on this platform will be handled
              responsibly and will not be sold or shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. No Spam or Automated Abuse
            </h2>
            <p>
              Automated scripts, bots, spam submissions, or excessive network
              requests intended to degrade system performance are not allowed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              5. Appropriate Use of Testing Tools
            </h2>
            <p>
              This platform provides API testing functionality. Users are
              expected to test only endpoints they own or have permission to
              use. Misuse of API tools for attacking or probing unauthorized
              services is strictly forbidden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Account Responsibility
            </h2>
            <p>
              Users are responsible for all activity performed under their
              accounts. Sharing authentication tokens or attempting to
              impersonate others is not permitted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Policy Violations</h2>
            <p>
              Failure to adhere to the terms listed may result in warnings,
              account suspension, or permanent removal, depending on severity.
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          These policies may be updated periodically to ensure platform safety
          and compliance.
        </p>
      </div>
    </div>
  );
}
