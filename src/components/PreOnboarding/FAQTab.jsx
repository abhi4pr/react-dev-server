import "./onboardcss/onboard_style.css";
import "./onboardcss/onboard_responsive.css";
import "./onboardcss/onboard_animate.min.css";

const FAQTab = ({ username, designation }) => {
  return (
    <>
      <div className="cardBoard">
        <div className="cardBodyBoard">
          <div className="policyarea">
            <div className="thm_texthead">
              <h2 className="text-center">FAQ (Frequently Asked Questions)</h2>
              <div className="thm_textarea">
                {/* <div className="thm_textbx">
                  <p>
                    Hello {username}, Welcome to Creativefuel - The home to the
                    most vibrant & talented individuals!
                    <br />
                    <br />
                    We're to have you join our team of Meme Enthusiasts & Coffee
                    Addicts as a {designation} ! We believe that your experience
                    & skills will be a great asset to our organisation.
                    <br />
                    <br />
                    Congratulations on your new role, and cheers to a journey
                    full of excitement, growth & achievement!
                  </p>
                </div> */}
                <div className="thm_textbx">
                  <h3>1. What is Salary cycle?</h3>
                  <p>
                    <span className="bold">Ans:- </span>
                    Salary cycle refers to the regular interval at which
                    employees are paid their salaries. The salary cycle in
                    creativefuel is calculated for 26 working days excluding
                    Sundays, and the number of days will be decreased if there
                    is any national holiday.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    2.What is the duration of the notice period that needs to be
                    served?
                  </h3>
<<<<<<< Updated upstream
                  <p>
                    <span className="bold">Ans:- </span>60 Days
                  </p>
=======
                  <p>60 Days</p>
>>>>>>> Stashed changes
                </div>
                <div className="thm_textbx">
                  <h3>
                    3. What is the notice period that needs to be served under
                    probation?
                  </h3>
<<<<<<< Updated upstream
                  <p>
                    <span className="bold">Ans:- </span>7 Days
                  </p>
=======
                  <p>7 Days</p>
>>>>>>> Stashed changes
                </div>
                <div className="thm_textbx">
                  <h3>
                    4. Am I eligible for paid leave during the probationary
                    period (6 months)?
                  </h3>
                  <p>
                    <span className="bold">Ans:- </span>
                    Yes, you are eligible to take paid leaves after 3 months of
                    your joining period.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    5. What is the aim behind designing the Onboarding process?
                  </h3>
                  <p>
                    <span className="bold">Ans:- </span>
                    The onboarding process for Creativefuel employees is
                    designed to integrate new team members into our creative
                    culture, acquaint them with their key roles and
                    responsibilities, and provide the necessary training and
                    resources for them to excel in their positions.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>6. When Performance Evaluation is done?</h3>
                  <p>
                    <span className="bold">Ans:- </span>
                    In the month of January, the performance of employees are
                    evaluated.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>7.What are the standard working hours of the company?</h3>
                  <p>
                    <span className="bold">Ans:- </span>9 Hours including lunch
                    break.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    8.What are the prerequisites for employees to be eligible
                    for working from home (WFH)?
                  </h3>
                  <p>
                    <span className="bold">Ans:- </span>* Prior approval must be
                    obtained before taking leave from the regular office and
                    working from home. Failure to obtain such approval may
                    result in the employee being considered absent from work.
                  </p>
                  <p>
                    * Work from home will be considered half-day attendance, and
                    accordingly, the employee will receive only 50% of there
                    salary for that day.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    9. What is the official Email ID for sharing any concerns or
                    queries
                  </h3>
                  <p>
<<<<<<< Updated upstream
                    <span className="bold">Ans:- </span>
=======
>>>>>>> Stashed changes
                    The HR E-mail ID,
                    <a
                      style={{ color: "blue" }}
                      href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=hr@creativefuel.io"
                    >
                      {" "}
                      hr@creativefuel.io
                    </a>
                    , should only be used for talent acquisition, such as
                    requesting Introducing new team members or recommending
                    someone for a position. All other human resource concerns,
                    such as payroll, leave, and reimbursement, should be
                    directed to{" "}
                    <a
                      style={{ color: "blue" }}
                      href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to= fabhr@creativefuel.io"
                    >
                      {" "}
                      fabhr@creativefuel.io
                    </a>
                    . Please ensure that every email is cc'd to{" "}
                    <a
                      style={{ color: "blue" }}
                      href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=nikhil@creativefuel.io"
                    >
                      {" "}
<<<<<<< Updated upstream
                      nikhil@creativefuel.io,
                    </a>{" "}
=======
                      nikhil@creativefuel.io
                    </a>{" "}
                    ,
>>>>>>> Stashed changes
                    <a
                      style={{ color: "blue" }}
                      href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=tushar@creativefuel.io"
                    >
<<<<<<< Updated upstream
                      tushar@creativefuel.io{" "}
=======
                      {" "}
                      tushar@creativefuel.io
>>>>>>> Stashed changes
                    </a>
                    and your team leader when necessary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQTab;
