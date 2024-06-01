import React from "react";

const LetterTabPdf4ESIC = ({ UserDetails }) => {
  const salary = UserDetails?.ctc;

  const basicSalary = salary * 0.6;

  const basicsal = (basicSalary < 12000 ? salary * 0.8 : basicSalary).toFixed(
    0
  );

  const HRA = basicsal * 0.3;

  const AdvanceBonus = (basicsal * 0.2).toFixed(0);

  const addbasicAdvance = Number(basicsal) + Number(AdvanceBonus);

  const monthlyEncashment = ((basicsal / 26) * 3).toFixed(0);

  const monthEncash =
    basicsal < 12000 ? salary - addbasicAdvance : monthlyEncashment;

  const specialAllowance =
    salary - basicsal - HRA - AdvanceBonus - monthlyEncashment;

  const EmployeePF = parseFloat(
    (basicsal < 14000 ? basicsal * 0.12 : 1800).toFixed(0)
  );
  const EmployeESIC = parseFloat(((salary * 0.75) / 100).toFixed(0));

  const EmployeerESIC = parseFloat(((salary * 3.25) / 100).toFixed(0));

  const TotalEarnings =
    basicsal < 12000
      ? Number(basicsal) + Number(AdvanceBonus) + Number(monthEncash)
      : Number(basicsal) +
        Number(HRA) +
        Number(AdvanceBonus) +
        Number(monthEncash) +
        Number(specialAllowance);

  const TotalCTC =
    salary >= 21000
      ? Number(salary) + Number(EmployeePF)
      : Number(salary) + Number(EmployeePF) + Number(EmployeerESIC);
  return (
    <>
      <div className="ol-table">
        <p className="underlined bold">Renumeration Structure & Break-up </p>
        <table>
          <thead>
            <tr>
              <th>EARNINGS</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td>INR {basicsal}</td>
              <td>INR {basicsal * 12}</td>
            </tr>
            {basicSalary > 12000 && (
              <tr>
                <td>HRA</td>
                <td>INR {HRA}</td>
                <td>INR {HRA * 12}</td>
              </tr>
            )}
            <tr>
              <td>Advance Bonus</td>
              <td>INR {AdvanceBonus}</td>
              <td>INR {AdvanceBonus * 12}</td>
            </tr>
            <tr>
              <td>Monthly Leave Encashment</td>
              <td>INR {monthEncash}</td>
              <td>INR {monthEncash * 12}</td>
            </tr>
            {basicSalary > 12000 && (
              <tr>
                <td>Special Allowance</td>
                <td>INR {specialAllowance}</td>
                <td>INR {specialAllowance * 12}</td>
              </tr>
            )}
            <tr>
              <td>Total Earning</td>
              <td>INR {TotalEarnings}</td>
              <td>INR {TotalEarnings * 12}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>DEDUCTIONS</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PF Employee</td>
              <td>INR {EmployeePF}</td>
              <td>INR {EmployeePF * 12}</td>
            </tr>
            {salary < 21000 && (
              <tr>
                <td>ESIC Employee</td>
                <td>INR {EmployeESIC}</td>
                <td>INR {EmployeESIC * 12}</td>
              </tr>
            )}
            <tr>
              <td>Net Pay Before Tax</td>
              <td>
                INR{" "}
                {salary >= 21000
                  ? TotalEarnings - EmployeePF
                  : TotalEarnings - EmployeePF - EmployeESIC}
              </td>
              <td>
                INR{" "}
                {salary >= 21000
                  ? TotalEarnings * 12 - EmployeePF * 12
                  : TotalEarnings * 12 - EmployeePF * 12 - EmployeESIC * 12}
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>Contribution</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PF Employer</td>
              <td>INR {EmployeePF}</td>
              <td>INR {EmployeePF * 12}</td>
            </tr>
            {salary < 21000 && (
              <tr>
                <td>ESIC Employer</td>
                <td>INR {EmployeerESIC}</td>
                <td>INR {EmployeerESIC * 12}</td>
              </tr>
            )}
            <tr>
              <td>Total CTC</td>
              <td>INR {TotalCTC}</td>
              <td>INR {TotalCTC * 12}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LetterTabPdf4ESIC;
