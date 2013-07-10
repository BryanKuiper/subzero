define("mockdata", ["modelfactory"], function(ModelFactory) {

    "use strict";

    var objects = {};
    function signObject(type, attr) {
        objects[attr.eid] = ModelFactory.createModel(type, attr);
    }

    signObject("blog", {
        "eid": "blog001",
        "title": "The most populair testing frameworks",
        "body": "When a student has a consolidation loan, the school can determine his or her " +
            "remaining loan eligibility by using the original principal loan amount minus any " +
            "payments made. Note: The outstanding balance on the subsidized and unsubsidized " +
            "portions of the consolidation loan is considered when determining the borrower's " +
            "subsidized and unsubsidized loan limits. For example, if a consolidation loan " +
            "contains an unsubsidized portion, the outstanding balance on the unsubsidized " +
            "portion of the consolidation is considered in determining the borrower's " +
            "unsubsidized loan limit. Schools can determine the subsidized and unsubsidized " +
            "portion of the consolidation loan: reviewing the borrower's consolidation " +
            "paperwork. contacting the Loan Origination Center/ Loan Consolidation Department. " +
            "using the National Student Loan Data System (NSLDS). If data is available on " +
            "NSLDS, schools may be able to view the underlying loans in the consolidation loan" +
            " to determine the loan type. Schools can access NSLDS online and find the loans " +
            "that were paid off through consolidation by selecting all loans with a status " +
            "code of PC (paid through consolidation).",
        "author": "Alexander Oldenburg",
        "numOfComments": 1,
        "postedOn": "2013-05-24T12:03:14.012+01:00"
    });

    signObject("blog", {
        "eid": "blog002",
        "title": "The most populair testing frameworks",
        "body": "As you prepare for one of the biggest (and best) days of your life, you may be " +
                "worrying about money. The ceremony, reception, and honeymoon are expensive, but " +
                "you might be surprised to learn that getting married can save you money in " +
                "unexpected ways.Car Insurance. Marriage can lower your car insurance rates. " +
                "Married people are considered safer and more stable because of their new " +
                "commitment and responsibilities, and this can translate into discounts. As a " +
                "couple, you may qualify for reduced car insurance rates with the same coverage. " +
                "You could also earn a multiple car discount if you combine both your cars on the " +
                "same policy. Depending on the driving records and cars of you and your spouse, " +
                "you may get a better car insurance rate with separate policies. If one of you has " +
                "a bad driving record, you might get better rates by taking a safe driver course. " +
                "The only way to know for sure is to compare car insurance quotes from different " +
                "companies.New Home or Apartment. If you’re moving to a new house or apartment, " +
                "your new ZIP code could get you lower car insurance rates. If it’s closer to " +
                "where you work or places you visit often, a new location could also lower the car " +
                "insurance quotes you get. That’s because you could qualify for a low-mileage " +
                "discount on your car insurance, something to look for if you or your spouse will" +
                " stay at home. Other Insurance. Be aware that you may need to look for different " +
                "insurance that covers your new wedding gifts and rings. Although your insurance " +
                "rates might go down in general, you’ll want to consider adding other types of " +
                "insurance and higher coverage amounts. Remember, you have more assets to protect " +
                "now, so you’ll need to examine all of your options. Keep in mind that you might " +
                "get better rates if you buy multiple types of insurance from the same company.Life" +
                " Changes. Whenever you have changes in your life, it’s a good idea to see if your " +
                "insurance rates have changed and if you need different coverage. Life insurance, " +
                "home or renters insurance, disability insurance, beneficiaries… it can seem " +
                "overwhelming, but our many informative articles can help you understand insurance." +
                " With all the changes in your life, you’ll need to shop around, which is easy " +
                "with Insurance.com’s free online car insurance rate tool.",
        "author": "Alexander Oldenburg",
        "numOfComments": 3,
        "postedOn": "2013-05-24T12:02:54.012+01:00"
    });

    return objects;
});
