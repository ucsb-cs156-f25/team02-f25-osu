package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_menu_item() throws Exception {
    setupUser(true);

    page.getByText("UCSB Dining Commons Menu Items").click();

    page.getByText("Create UCSB Dining Commons Menu Item").click();
    assertThat(page.getByText("Create New Menu Item")).isVisible();
    page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Carnitas Burrito");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Ortega");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Mexican Grill");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .hasText("Carnitas Burrito");
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .hasText("Ortega");
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
        .hasText("Mexican Grill");

    page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit UCSB Dining Commons Menu Item")).isVisible();
    page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Edited Name");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Edited Code");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Edited Station");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .hasText("Edited Name");
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .hasText("Edited Code");
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
        .hasText("Edited Station");

    page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_menu_item() throws Exception {
    setupUser(false);

    page.getByText("UCSB Dining Commons Menu Items").click();

    assertThat(page.getByText("Create UCSB Dining Commons Menu Item")).not().isVisible();
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }
}
