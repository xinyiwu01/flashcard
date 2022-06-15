package edu.cmu.cs214.hw1.ordering.prioritization;

import edu.cmu.cs214.hw1.cards.CardStatus;
import edu.cmu.cs214.hw1.ordering.CardOrganizer;

import java.util.List;
import java.util.ArrayList;


public class RecentMistakesFirstSorter implements CardOrganizer {

    /**
     * Orders the cards by the correctness of the last round.
     *
     * @param cards The {@link CardStatus} objects to order.
     * @return The ordered cards.
     */
    @Override
    public List<CardStatus> reorganize(List<CardStatus> cards) {
        List<CardStatus> cardsList = new ArrayList<>();
        List<CardStatus> correctCards = new ArrayList<>();
        for (CardStatus cardStatus : cards) {
            List<Boolean> successes = cardStatus.getResults();
            if ( !successes.get(successes.size() - 1)) {
                cardsList.add(cardStatus);
            } else {
                correctCards.add(cardStatus);
            }
        }
        cardsList.addAll(correctCards);
        return cardsList;
    }
}
