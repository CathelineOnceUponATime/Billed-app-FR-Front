/* global describe, test, jest, expect, File */
/* eslint no-undef: "error" */

import { screen, fireEvent } from '@testing-library/dom'
import user from '@testing-library/user-event'
import { ROUTES } from '../constants/routes'
import { localStorageMock } from '../__mocks__/localStorage.js'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import store from '../app/Store.js'

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then ...', () => {
      const bills = {
        id: '47qAXb6fIm2zOKkLzMro',
        vat: '7',
        fileUrl: 'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a',
        status: 'pending',
        type: 'Hôtel et logement',
        commentary: 'commentaire',
        name: 'Train',
        fileName: 'preview-facture-free-201801-pdf-1.jpg',
        date: '2022-01-01',
        amount: '150',
        commentAdmin: 'ok',
        email: 'a@a',
        pct: '20'
      }

      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const unBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })

      const inputTypeDepense = screen.getByTestId('expense-type')
      expect(inputTypeDepense).not.toBeUndefined()
      // fireEvent.click(screen.getByText(bills.type))
      fireEvent.change(inputTypeDepense, { target: { value: bills.type } })
      expect(inputTypeDepense.value).toBe(bills.type)

      const inputDepense = screen.getByTestId('expense-name')
      expect(inputDepense).not.toBeUndefined()
      fireEvent.change(inputDepense, { target: { value: bills.name } })
      expect(inputDepense.value).toBe(bills.name)

      const inputDate = screen.getByTestId('datepicker')
      expect(inputDate).not.toBeUndefined()
      fireEvent.change(inputDate, { target: { value: bills.date } })
      expect(inputDate.value).toBe(bills.date)

      const inputMontantTTC = screen.getByTestId('amount')
      expect(inputMontantTTC).not.toBeUndefined()
      fireEvent.change(inputMontantTTC, { target: { value: bills.amount } })
      expect(inputMontantTTC.value).toBe(bills.amount)

      const inputVat = screen.getByTestId('vat')
      expect(inputVat).not.toBeUndefined()
      fireEvent.change(inputVat, { target: { value: bills.vat } })
      expect(inputVat.value).toBe(bills.vat)

      const inputPct = screen.getByTestId('pct')
      expect(inputPct).not.toBeUndefined()
      fireEvent.change(inputPct, { target: { value: bills.pct } })
      expect(inputPct.value).toBe(bills.pct)

      const inputCommentaire = screen.getByTestId('commentary')
      expect(inputCommentaire).not.toBeUndefined()
      fireEvent.change(inputCommentaire, { target: { value: bills.commentary } })
      expect(inputCommentaire.value).toBe(bills.commentary)

      const form = screen.getByTestId('form-new-bill')

      /* const inputFile = screen.getByTestId('file')
      const handleChangeFile = jest.fn(unBill.handleChangeFile)
      form.addEventListener('change', handleChangeFile) */

      const handleSubmit = jest.fn(unBill.handleSubmit)
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    })
  })
})
