Feature: Library lending
  Members borrow books, return them, and pay fines when late.

  Background:
    Given today is "2026-03-01"
    And the library has 2 copies of "978-1" titled "Refactoring"
    And the library has 1 copy of "978-2" titled "Clean Code"

  Scenario: Borrowing reduces availability
    When "ann" borrows "978-1"
    Then 1 copy of "978-1" is available
    And "ann" has 1 loan due "2026-03-15"

  Scenario: Last copy cannot be borrowed twice
    When "ann" borrows "978-2"
    And "bob" borrows "978-2"
    Then I see the error "no copies available"

  Scenario: Loan limit is three
    Given the library has 5 copies of "978-3" titled "DDD"
    And the library has 5 copies of "978-4" titled "TDD"
    When "ann" borrows "978-1"
    And "ann" borrows "978-2"
    And "ann" borrows "978-3"
    And "ann" borrows "978-4"
    Then I see the error "loan limit reached"

  Scenario: Returning on time has no fine
    When "ann" borrows "978-1"
    And today is "2026-03-15"
    And "ann" returns "978-1"
    Then "ann" owes 0.00
    And 2 copies of "978-1" are available

  Scenario: Late return is fined fifty cents a day
    When "ann" borrows "978-1"
    And today is "2026-03-19"
    And "ann" returns "978-1"
    Then "ann" owes 2.00

  Scenario: Members with fines cannot borrow until paid
    When "ann" borrows "978-1"
    And today is "2026-03-20"
    And "ann" returns "978-1"
    And "ann" borrows "978-2"
    Then I see the error "outstanding fines"
    When "ann" pays 2.50
    And "ann" borrows "978-2"
    Then "ann" has 1 loan due "2026-04-03"
