Feature: Shopping cart
  As a shopper
  I want my cart to total correctly
  So that I know what I will pay

  Background:
    Given the catalog contains
      | sku  | name       | price |
      | TEA  | Green tea  | 6.50  |
      | MUG  | Mug        | 12.00 |
      | BOOK | Cookbook   | 30.00 |

  Scenario: Empty cart costs nothing
    Then the cart total is 0.00
    And shipping is 0.00

  Scenario: Adding the same item twice merges lines
    When I add 1 "TEA"
    And I add 2 "TEA"
    Then the cart has 3 items
    And the subtotal is 19.50

  Scenario: Shipping is charged under fifty
    When I add 1 "MUG"
    Then shipping is 4.99
    And the cart total is 16.99

  Scenario: Free shipping at fifty
    When I add 1 "BOOK"
    And I add 2 "MUG"
    Then shipping is 0.00
    And the cart total is 54.00

  Scenario: Welcome coupon takes ten percent
    When I add 1 "BOOK"
    And I apply coupon "WELCOME10"
    Then the discount is 3.00
    And shipping is 4.99
    And the cart total is 31.99

  Scenario: Free shipping coupon
    When I add 1 "TEA"
    And I apply coupon "FREESHIP"
    Then the cart total is 6.50

  Scenario Outline: Bad input is rejected
    When I add <qty> "<sku>"
    Then I see the error "<message>"

    Examples:
      | qty | sku  | message                 |
      | 0   | TEA  | quantity must be positive |
      | 1   | NOPE | unknown product NOPE    |

  Scenario: Invalid coupon
    When I apply coupon "BOGUS"
    Then I see the error "invalid coupon"
