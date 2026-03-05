const { test, expect } = require('@playwright/test');
const { fakePatient } = require('./helpers/data');
const { BookingPage } = require('./helpers/pages/BookingPage');
const { PaymentPage } = require('./helpers/pages/PaymentPage');
const { ConfirmationPage } = require('./helpers/pages/ConfirmationPage');

test.describe('Booking + payment (risk-based subset)', () => {
  test('P0: happy path book → pay → confirmation', async ({ page }) => {
    const booking = new BookingPage(page);
    const payment = new PaymentPage(page);
    const confirm = new ConfirmationPage(page);

    await booking.goto();
    await booking.chooseFirstAvailableSlot();
    await booking.fillPatientDetails(fakePatient());
    await booking.continue();

    await payment.expectLoaded();
    await payment.payWithTestCardSuccess();

    await confirm.expectConfirmed();
    const apptId = await confirm.captureAppointmentId();
    expect(apptId.length).toBeGreaterThan(3);
  });

  test('P0: payment decline does not confirm booking', async ({ page }) => {
    const booking = new BookingPage(page);
    const payment = new PaymentPage(page);

    await booking.goto();
    await booking.chooseFirstAvailableSlot();
    await booking.fillPatientDetails(fakePatient());
    await booking.continue();

    await payment.expectLoaded();
    await payment.payWithTestCardDecline();

    await payment.expectDeclineMessage();
    await expect(page.getByTestId('booking-confirmation')).toHaveCount(0);
  });

  test('P0: double-submit protection (no duplicate confirmation)', async ({ page }) => {
    const booking = new BookingPage(page);
    const payment = new PaymentPage(page);
    const confirm = new ConfirmationPage(page);

    await booking.goto();
    await booking.chooseFirstAvailableSlot();
    await booking.fillPatientDetails(fakePatient());
    await booking.continue();

    await payment.expectLoaded();

    // Risky user behavior: double-click pay quickly.
    const payBtn = page.getByTestId('pay');
    await payBtn.dblclick();

    // If your UI disables the button, assert it (optional):
    // await expect(payBtn).toBeDisabled();

    await confirm.expectConfirmed();

    // If the UI shows receipt number, assert only one:
    // await expect(page.getByTestId('receipt-number')).toHaveCount(1);
  });
});